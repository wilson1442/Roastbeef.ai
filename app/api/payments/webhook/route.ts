import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { grantTokens } from '@/lib/tokens';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import Stripe from 'stripe';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;

      if (session.metadata?.type === 'token_purchase') {
        const userId = session.metadata.userId;
        const quantity = parseInt(session.metadata.quantity || '1');

        await grantTokens(userId, quantity, 'purchase', session.payment_intent as string);
      }
    }

    if (event.type === 'customer.subscription.created' || event.type === 'customer.subscription.updated') {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;

      await dbConnect();
      const user = await User.findOne({ stripeCustomerId: customerId });

      if (user) {
        user.subscriptionId = subscription.id;
        user.subscriptionStatus = subscription.status === 'active' ? 'active' : 'cancelled';
        await user.save();

        // Grant subscription tokens
        if (subscription.status === 'active') {
          await grantTokens(user._id.toString(), 5, 'subscription');
        }
      }
    }

    if (event.type === 'invoice.payment_succeeded') {
      const invoice = event.data.object as Stripe.Invoice;
      const subscriptionId = invoice.subscription as string;

      await dbConnect();
      const user = await User.findOne({ subscriptionId });

      if (user && user.subscriptionStatus === 'active') {
        // Grant monthly subscription tokens
        await grantTokens(user._id.toString(), 5, 'subscription');
      }
    }

    if (event.type === 'customer.subscription.deleted') {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;

      await dbConnect();
      const user = await User.findOne({ stripeCustomerId: customerId });

      if (user) {
        user.subscriptionStatus = 'cancelled';
        await user.save();
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error('Webhook handler error:', error);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}
