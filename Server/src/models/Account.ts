import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IAccount extends Document {
  name: string;
  description?: string;
  type: 'bank' | 'credit_card' | 'cash' | 'investment' | 'savings' | 'loan' | 'other';
  currency: string; // ISO currency code (USD, EUR, etc.)
  initialBalance: number;
  currentBalance: number;
  color: string; // Hex color for UI display
  icon?: string; // Icon identifier for UI
  accountNumber?: string; // Last 4 digits or masked number
  bankName?: string;
  isActive: boolean;
  includeInNetWorth: boolean; // Whether to include in net worth calculations
  userId: Types.ObjectId; // Reference to User
  createdAt: Date;
  updatedAt: Date;
}

const accountSchema = new Schema<IAccount>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  type: {
    type: String,
    enum: ['bank', 'credit_card', 'cash', 'investment', 'savings', 'loan', 'other'],
    required: true
  },
  currency: {
    type: String,
    required: true,
    default: 'USD',
    uppercase: true,
    minlength: 3,
    maxlength: 3
  },
  initialBalance: {
    type: Number,
    required: true,
    default: 0
  },
  currentBalance: {
    type: Number,
    required: true,
    default: 0
  },
  color: {
    type: String,
    required: true,
    match: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/ // Hex color validation
  },
  icon: {
    type: String,
    trim: true
  },
  accountNumber: {
    type: String,
    trim: true
  },
  bankName: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  includeInNetWorth: {
    type: Boolean,
    default: true
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

// Virtual population for transactions
accountSchema.virtual('transactions', {
  ref: 'Transaction',
  localField: '_id',
  foreignField: 'account'
});

// Indexes for better performance
accountSchema.index({ userId: 1, type: 1 });
accountSchema.index({ userId: 1, isActive: 1 });
accountSchema.index({ userId: 1, includeInNetWorth: 1 });

// Ensure unique account names per user
accountSchema.index({ userId: 1, name: 1 }, { unique: true });

// Pre-save middleware to update current balance based on initial balance
accountSchema.pre('save', function(next) {
  if (this.isNew) {
    this.currentBalance = this.initialBalance;
  }
  next();
});

const Account = mongoose.model<IAccount>('Account', accountSchema);

export default Account; 