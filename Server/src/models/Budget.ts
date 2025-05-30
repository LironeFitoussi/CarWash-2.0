import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IBudget extends Document {
  name: string;
  description?: string;
  category: Types.ObjectId; // Reference to Category
  amount: number; // Budget limit amount
  period: 'monthly' | 'yearly';
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  alertThreshold: number; // Percentage (0-100) when to send alerts
  currentSpent: number; // Current amount spent in this period
  notifications: {
    onThresholdReached: boolean;
    onBudgetExceeded: boolean;
    weeklyReport: boolean;
  };
  userId: Types.ObjectId; // Reference to User
  createdAt: Date;
  updatedAt: Date;
}

const budgetSchema = new Schema<IBudget>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  period: {
    type: String,
    enum: ['monthly', 'yearly'],
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  alertThreshold: {
    type: Number,
    min: 0,
    max: 100,
    default: 80 // 80% by default
  },
  currentSpent: {
    type: Number,
    default: 0,
    min: 0
  },
  notifications: {
    onThresholdReached: {
      type: Boolean,
      default: true
    },
    onBudgetExceeded: {
      type: Boolean,
      default: true
    },
    weeklyReport: {
      type: Boolean,
      default: false
    }
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

// Virtual fields for calculations
budgetSchema.virtual('percentageUsed').get(function() {
  return this.amount > 0 ? (this.currentSpent / this.amount) * 100 : 0;
});

budgetSchema.virtual('remainingAmount').get(function() {
  return Math.max(0, this.amount - this.currentSpent);
});

budgetSchema.virtual('isOverBudget').get(function() {
  return this.currentSpent > this.amount;
});

budgetSchema.virtual('isThresholdReached').get(function() {
  return (this.currentSpent / this.amount) * 100 >= this.alertThreshold;
});

// Indexes for better performance
budgetSchema.index({ userId: 1, category: 1 });
budgetSchema.index({ userId: 1, period: 1 });
budgetSchema.index({ userId: 1, isActive: 1 });
budgetSchema.index({ startDate: 1, endDate: 1 });

// Ensure unique budget per category per period per user
budgetSchema.index({ userId: 1, category: 1, period: 1, startDate: 1 }, { unique: true });

// Pre-save validation
budgetSchema.pre('save', function(next) {
  if (this.endDate <= this.startDate) {
    const error = new Error('End date must be after start date');
    return next(error);
  }
  next();
});

const Budget = mongoose.model<IBudget>('Budget', budgetSchema);

export default Budget; 