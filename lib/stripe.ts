import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-06-20.acacia',
});

export const TOKEN_PRICE = 299; // $2.99 in cents
export const SUBSCRIPTION_PRICE = 500; // $5.00 in cents
export const SUBSCRIPTION_TOKENS = 5;
