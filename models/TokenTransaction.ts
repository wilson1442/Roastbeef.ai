import mongoose, { Schema, Model } from 'mongoose';
import { IUser } from './User';

export interface ITokenTransaction {
  userId: mongoose.Types.ObjectId | IUser;
  type: 'signup_bonus' | 'monthly_grant' | 'purchase' | 'usage' | 'subscription';
  amount: number;
  stripePaymentIntentId?: string;
  createdAt: Date;
}

const TokenTransactionSchema = new Schema<ITokenTransaction>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['signup_bonus', 'monthly_grant', 'purchase', 'usage', 'subscription'],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    stripePaymentIntentId: {
      type: String,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

const TokenTransaction: Model<ITokenTransaction> =
  mongoose.models.TokenTransaction || mongoose.model<ITokenTransaction>('TokenTransaction', TokenTransactionSchema);

export default TokenTransaction;
