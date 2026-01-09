import mongoose, { Schema, Model } from 'mongoose';

export interface IUser {
  email: string;
  password: string;
  emailVerified: boolean;
  emailVerificationToken?: string;
  tokens: number;
  lastTokenGrantDate?: Date;
  stripeCustomerId?: string;
  subscriptionId?: string;
  subscriptionStatus: 'none' | 'active' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: {
      type: String,
    },
    tokens: {
      type: Number,
      default: 5,
    },
    lastTokenGrantDate: {
      type: Date,
    },
    stripeCustomerId: {
      type: String,
    },
    subscriptionId: {
      type: String,
    },
    subscriptionStatus: {
      type: String,
      enum: ['none', 'active', 'cancelled'],
      default: 'none',
    },
  },
  {
    timestamps: true,
  }
);

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
