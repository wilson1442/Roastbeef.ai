import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { stripe, TOKEN_PRICE } from '@/lib/stripe';
import { z } from 'zod';

const createCheckoutSchema = z.object({
  quantity: z.number().int().min(1).max(100),
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { quantity } = createCheckoutSchema.parse(body);

    await dbConnect();

    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Create or get Stripe customer
    let customerId = user.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          userId: user._id.toString(),
        },
      });
      customerId = customer.id;
      user.stripeCustomerId = customerId;
      await user.save();
    }

    // Create checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'RoastBeef.ai Tokens',
              description: `${quantity} token(s)`,
            },
            unit_amount: TOKEN_PRICE,
          },
          quantity: quantity,
        },
      ],
      success_url: `${process.env.NEXTAUTH_URL}/pricing?payment=success&tokens=${quantity}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/pricing?payment=cancelled`,
      metadata: {
        userId: user._id.toString(),
        type: 'token_purchase',
        quantity: quantity.toString(),
      },
    });

    return NextResponse.json({ url: checkoutSession.url }, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    console.error('Create checkout session error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
