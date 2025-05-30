import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  description?: string;
  type: 'income' | 'expense' | 'both';
  color: string; // Hex color for UI display
  icon?: string; // Icon identifier for UI
  parentCategory?: Types.ObjectId; // Reference to parent category for subcategories
  isActive: boolean;
  monthlyBudget?: number; // Optional budget limit for expense categories
  userId: Types.ObjectId; // Reference to User
  createdAt: Date;
  updatedAt: Date;
  subcategories?: any[]; // Virtual field for populated subcategories
}

const categorySchema = new Schema<ICategory>({
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
    enum: ['income', 'expense', 'both'],
    required: true
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
  parentCategory: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  },
  monthlyBudget: {
    type: Number,
    min: 0
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

// Virtual population for subcategories
categorySchema.virtual('subcategories', {
  ref: 'Category',
  localField: '_id',
  foreignField: 'parentCategory'
});

// Virtual population for transactions
categorySchema.virtual('transactions', {
  ref: 'Transaction',
  localField: '_id',
  foreignField: 'category'
});

// Indexes for better performance
categorySchema.index({ userId: 1, type: 1 });
categorySchema.index({ userId: 1, parentCategory: 1 });
categorySchema.index({ userId: 1, isActive: 1 });

// Ensure unique category names per user
categorySchema.index({ userId: 1, name: 1 }, { unique: true });

const Category = mongoose.model<ICategory>('Category', categorySchema);

export default Category; 