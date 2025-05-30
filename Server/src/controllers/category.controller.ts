import { Request, Response } from 'express';
import Category from '../models/Category';

// Get all categories for a user
export const getCategories = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 50, type, parentCategory } = req.query;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const filter: any = { userId, isActive: true };
    
    if (type && ['income', 'expense', 'both'].includes(type as string)) {
      filter.type = type;
    }
    
    if (parentCategory) {
      filter.parentCategory = parentCategory;
    } else if (parentCategory !== 'all') {
      // By default, only get top-level categories (no parent)
      filter.parentCategory = null;
    }

    const skip = (Number(page) - 1) * Number(limit);
    
    const categories = await Category.find(filter)
      .populate('subcategories')
      .sort({ name: 1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Category.countDocuments(filter);
    const pages = Math.ceil(total / Number(limit));

    res.json({
      categories,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages
      }
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Error fetching categories' });
  }
};

// Get a single category by ID
export const getCategoryById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const category = await Category.findOne({ _id: id, userId })
      .populate('subcategories')
      .populate('parentCategory', 'name color');

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json(category);
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({ message: 'Error fetching category' });
  }
};

// Create a new category
export const createCategory = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const categoryData = { ...req.body, userId };

    // If parentCategory is provided, validate it exists and belongs to user
    if (categoryData.parentCategory) {
      const parentCategory = await Category.findOne({ 
        _id: categoryData.parentCategory, 
        userId 
      });
      
      if (!parentCategory) {
        return res.status(400).json({ message: 'Invalid parent category' });
      }
    }

    const category = new Category(categoryData);
    await category.save();

    const populatedCategory = await Category.findById(category._id)
      .populate('parentCategory', 'name color');

    res.status(201).json(populatedCategory);
  } catch (error: any) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Category name already exists' });
    }
    console.error('Error creating category:', error);
    res.status(500).json({ message: 'Error creating category' });
  }
};

// Update a category
export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const updateData = req.body;

    // If parentCategory is being updated, validate it
    if (updateData.parentCategory) {
      const parentCategory = await Category.findOne({ 
        _id: updateData.parentCategory, 
        userId 
      });
      
      if (!parentCategory) {
        return res.status(400).json({ message: 'Invalid parent category' });
      }

      // Prevent circular references
      if (updateData.parentCategory === id) {
        return res.status(400).json({ message: 'Category cannot be its own parent' });
      }
    }

    const updatedCategory = await Category.findOneAndUpdate(
      { _id: id, userId },
      updateData,
      { new: true, runValidators: true }
    )
      .populate('parentCategory', 'name color')
      .populate('subcategories');

    if (!updatedCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json(updatedCategory);
  } catch (error: any) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Category name already exists' });
    }
    console.error('Error updating category:', error);
    res.status(500).json({ message: 'Error updating category' });
  }
};

// Delete a category (soft delete by setting isActive to false)
export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const category = await Category.findOne({ _id: id, userId });
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Check if category has transactions
    const Transaction = require('../models/Transaction').default;
    const transactionCount = await Transaction.countDocuments({ category: id });
    
    if (transactionCount > 0) {
      // Soft delete - just mark as inactive
      await Category.findByIdAndUpdate(id, { isActive: false });
      res.json({ message: 'Category deactivated successfully (has existing transactions)' });
    } else {
      // Hard delete if no transactions
      await Category.findByIdAndDelete(id);
      res.json({ message: 'Category deleted successfully' });
    }
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ message: 'Error deleting category' });
  }
};

// Get category statistics
export const getCategoryStats = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const { startDate, endDate } = req.query;
    
    const Transaction = require('../models/Transaction').default;
    const matchFilter: any = { userId };
    
    if (startDate || endDate) {
      matchFilter.date = {};
      if (startDate) matchFilter.date.$gte = new Date(startDate as string);
      if (endDate) matchFilter.date.$lte = new Date(endDate as string);
    }

    const categoryStats = await Transaction.aggregate([
      { $match: matchFilter },
      {
        $group: {
          _id: '$category',
          totalAmount: { $sum: '$amount' },
          transactionCount: { $sum: 1 },
          avgAmount: { $avg: '$amount' },
          incomeTotal: {
            $sum: {
              $cond: [{ $eq: ['$type', 'income'] }, '$amount', 0]
            }
          },
          expenseTotal: {
            $sum: {
              $cond: [{ $eq: ['$type', 'expense'] }, '$amount', 0]
            }
          }
        }
      },
      {
        $lookup: {
          from: 'categories',
          localField: '_id',
          foreignField: '_id',
          as: 'categoryInfo'
        }
      },
      {
        $unwind: '$categoryInfo'
      },
      {
        $project: {
          name: '$categoryInfo.name',
          color: '$categoryInfo.color',
          type: '$categoryInfo.type',
          totalAmount: 1,
          transactionCount: 1,
          avgAmount: 1,
          incomeTotal: 1,
          expenseTotal: 1
        }
      },
      { $sort: { totalAmount: -1 } }
    ]);

    res.json(categoryStats);
  } catch (error) {
    console.error('Error fetching category stats:', error);
    res.status(500).json({ message: 'Error fetching category stats' });
  }
}; 