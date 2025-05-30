import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ITransaction extends Document {
  title: string;
  description?: string;
  amount: number;
  type: 'income' | 'expense';
  category: Types.ObjectId; // Reference to Category
  account: Types.ObjectId; // Reference to Account
  date: Date;
  recurring?: {
    isRecurring: boolean;
    frequency?: 'daily' | 'weekly' | 'monthly' | 'yearly';
    endDate?: Date;
  };
  tags?: string[];
  attachments?: string[]; // URLs to receipt images or documents
  location?: string;
  notes?: string;
  userId: Types.ObjectId; // Reference to User
  createdAt: Date;
  updatedAt: Date;
}

const transactionSchema = new Schema<ITransaction>({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  type: {
    type: String,
    enum: ['income', 'expense'],
    required: true
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  account: {
    type: Schema.Types.ObjectId,
    ref: 'Account',
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  recurring: {
    isRecurring: {
      type: Boolean,
      default: false
    },
    frequency: {
      type: String,
      enum: ['daily', 'weekly', 'monthly', 'yearly']
    },
    endDate: {
      type: Date
    }
  },
  tags: [{
    type: String,
    trim: true
  }],
  attachments: [{
    type: String,
    trim: true
  }],
  location: {
    type: String,
    trim: true
  },
  notes: {
    type: String,
    trim: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
transactionSchema.index({ userId: 1, date: -1 });
transactionSchema.index({ userId: 1, type: 1 });
transactionSchema.index({ userId: 1, category: 1 });
transactionSchema.index({ userId: 1, account: 1 });
transactionSchema.index({ date: -1 });

const Transaction = mongoose.model<ITransaction>('Transaction', transactionSchema);

export default Transaction; 