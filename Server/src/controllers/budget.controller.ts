import { Request, Response } from 'express';
import Budget from '../models/Budget';
import Category from '../models/Category';

// Get all budgets for a user
export const getBudgets = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 20, period, isActive = 'true' } = req.query;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const filter: any = { userId };
    
    if (period && ['monthly', 'yearly'].includes(period as string)) {
      filter.period = period;
    }
    
    if (isActive !== 'all') {
      filter.isActive = isActive === 'true';
    }

    const skip = (Number(page) - 1) * Number(limit);
    
    const budgets = await Budget.find(filter)
      .populate('category', 'name color icon type')
      .sort({ startDate: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Budget.countDocuments(filter);
    const pages = Math.ceil(total / Number(limit));

    res.json({
      budgets,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages
      }
    });
  } catch (error) {
    console.error('Error fetching budgets:', error);
    res.status(500).json({ message: 'Error fetching budgets' });
  }
};

// Get a single budget by ID
export const getBudgetById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const budget = await Budget.findOne({ _id: id, userId })
      .populate('category', 'name color icon type');

    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    res.json(budget);
  } catch (error) {
    console.error('Error fetching budget:', error);
    res.status(500).json({ message: 'Error fetching budget' });
  }
};

// Create a new budget
export const createBudget = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const budgetData = { ...req.body, userId };

    // Validate category exists and belongs to user
    const category = await Category.findOne({ 
      _id: budgetData.category, 
      userId 
    });
    
    if (!category) {
      return res.status(400).json({ message: 'Invalid category' });
    }

    // Validate that category is for expenses (budgets are typically for expense categories)
    if (category.type === 'income') {
      return res.status(400).json({ 
        message: 'Budgets can only be created for expense or both-type categories' 
      });
    }

    const budget = new Budget(budgetData);
    await budget.save();

    const populatedBudget = await Budget.findById(budget._id)
      .populate('category', 'name color icon type');

    res.status(201).json(populatedBudget);
  } catch (error: any) {
    if (error.code === 11000) {
      return res.status(400).json({ 
        message: 'Budget already exists for this category and period' 
      });
    }
    console.error('Error creating budget:', error);
    res.status(500).json({ message: 'Error creating budget' });
  }
};

// Update a budget
export const updateBudget = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const updateData = req.body;

    // If category is being updated, validate it
    if (updateData.category) {
      const category = await Category.findOne({ 
        _id: updateData.category, 
        userId 
      });
      
      if (!category) {
        return res.status(400).json({ message: 'Invalid category' });
      }

      if (category.type === 'income') {
        return res.status(400).json({ 
          message: 'Budgets can only be created for expense or both-type categories' 
        });
      }
    }

    const updatedBudget = await Budget.findOneAndUpdate(
      { _id: id, userId },
      updateData,
      { new: true, runValidators: true }
    ).populate('category', 'name color icon type');

    if (!updatedBudget) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    res.json(updatedBudget);
  } catch (error: any) {
    if (error.code === 11000) {
      return res.status(400).json({ 
        message: 'Budget already exists for this category and period' 
      });
    }
    console.error('Error updating budget:', error);
    res.status(500).json({ message: 'Error updating budget' });
  }
};

// Delete a budget
export const deleteBudget = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const budget = await Budget.findOneAndDelete({ _id: id, userId });
    
    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    res.json({ message: 'Budget deleted successfully' });
  } catch (error) {
    console.error('Error deleting budget:', error);
    res.status(500).json({ message: 'Error deleting budget' });
  }
};

// Update budget spent amount based on transactions
export const updateBudgetSpent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const budget = await Budget.findOne({ _id: id, userId });
    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    const Transaction = require('../models/Transaction').default;
    
    // Calculate spent amount from transactions in budget period
    const spentResult = await Transaction.aggregate([
      {
        $match: {
          userId: userId,
          category: budget.category,
          type: 'expense',
          date: {
            $gte: budget.startDate,
            $lte: budget.endDate
          }
        }
      },
      {
        $group: {
          _id: null,
          totalSpent: { $sum: '$amount' }
        }
      }
    ]);

    const currentSpent = spentResult.length > 0 ? spentResult[0].totalSpent : 0;

    const updatedBudget = await Budget.findByIdAndUpdate(
      id,
      { currentSpent },
      { new: true }
    ).populate('category', 'name color icon type');

    res.json({
      message: 'Budget spent amount updated successfully',
      budget: updatedBudget,
      previousSpent: budget.currentSpent,
      newSpent: currentSpent
    });
  } catch (error) {
    console.error('Error updating budget spent:', error);
    res.status(500).json({ message: 'Error updating budget spent' });
  }
};

// Get budget performance summary
export const getBudgetSummary = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const { period = 'monthly' } = req.query;
    
    // Get current active budgets
    const currentDate = new Date();
    const budgets = await Budget.find({
      userId,
      isActive: true,
      period,
      startDate: { $lte: currentDate },
      endDate: { $gte: currentDate }
    }).populate('category', 'name color icon type');

    const summary = {
      totalBudgeted: 0,
      totalSpent: 0,
      totalRemaining: 0,
      budgetsOverLimit: 0,
      budgetsNearLimit: 0,
      budgetPerformance: [] as any[]
    };

    budgets.forEach(budget => {
      summary.totalBudgeted += budget.amount;
      summary.totalSpent += budget.currentSpent;
      summary.totalRemaining += Math.max(0, budget.amount - budget.currentSpent);

      if (budget.currentSpent > budget.amount) {
        summary.budgetsOverLimit++;
      } else if ((budget.currentSpent / budget.amount) * 100 >= budget.alertThreshold) {
        summary.budgetsNearLimit++;
      }

      summary.budgetPerformance.push({
        budgetId: budget._id,
        name: budget.name,
        category: budget.category,
        amount: budget.amount,
        spent: budget.currentSpent,
        remaining: Math.max(0, budget.amount - budget.currentSpent),
        percentageUsed: budget.amount > 0 ? (budget.currentSpent / budget.amount) * 100 : 0,
        isOverBudget: budget.currentSpent > budget.amount,
        isNearLimit: (budget.currentSpent / budget.amount) * 100 >= budget.alertThreshold
      });
    });

    res.json(summary);
  } catch (error) {
    console.error('Error fetching budget summary:', error);
    res.status(500).json({ message: 'Error fetching budget summary' });
  }
}; 