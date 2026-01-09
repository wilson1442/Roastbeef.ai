import mongoose, { Schema, Model } from 'mongoose';
import { IUser } from './User';

export interface IRoast {
  userId: mongoose.Types.ObjectId | IUser;
  url: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  n8nExecutionId?: string;
  result?: string;
  createdAt: Date;
  completedAt?: Date;
}

const RoastSchema = new Schema<IRoast>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed'],
      default: 'pending',
    },
    n8nExecutionId: {
      type: String,
    },
    result: {
      type: String,
    },
    completedAt: {
      type: Date,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

const Roast: Model<IRoast> = mongoose.models.Roast || mongoose.model<IRoast>('Roast', RoastSchema);

export default Roast;
