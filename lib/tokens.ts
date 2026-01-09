import dbConnect from './db';
import User from '@/models/User';
import TokenTransaction from '@/models/TokenTransaction';

export async function grantTokens(
  userId: string,
  amount: number,
  type: 'signup_bonus' | 'monthly_grant' | 'purchase' | 'subscription',
  stripePaymentIntentId?: string
): Promise<void> {
  await dbConnect();

  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  user.tokens += amount;
  await user.save();

  await TokenTransaction.create({
    userId,
    type,
    amount,
    stripePaymentIntentId,
  });
}

export async function useToken(userId: string): Promise<boolean> {
  await dbConnect();

  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  if (user.tokens < 1) {
    return false;
  }

  user.tokens -= 1;
  await user.save();

  await TokenTransaction.create({
    userId,
    type: 'usage',
    amount: -1,
  });

  return true;
}

export async function checkMonthlyTokenGrant(userId: string): Promise<boolean> {
  await dbConnect();

  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  if (!user.lastTokenGrantDate) {
    // First time checking, set the date but don't grant yet
    user.lastTokenGrantDate = new Date();
    await user.save();
    return false;
  }

  const now = new Date();
  const lastGrant = new Date(user.lastTokenGrantDate);
  
  // Check if a month has passed (approximately 30 days)
  const daysSinceGrant = Math.floor((now.getTime() - lastGrant.getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysSinceGrant >= 30) {
    user.tokens += 1;
    user.lastTokenGrantDate = now;
    await user.save();

    await TokenTransaction.create({
      userId,
      type: 'monthly_grant',
      amount: 1,
    });

    return true;
  }

  return false;
}

export async function getUserTokenBalance(userId: string): Promise<number> {
  await dbConnect();

  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  return user.tokens;
}
