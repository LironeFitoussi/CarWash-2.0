import { Request, Response } from 'express';
import Transaction from '../models/Transaction';
import Account from '../models/Account';
import Category from '../models/Category';
import mongoose from 'mongoose';

// Get all transactions for a user with filtering and pagination
export const getTransactions = async (req: Request, res: Response) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      type, 
      category, 
      account, 
      startDate, 
      endDate,
      search 
    } = req.query;

    const userId = req.user?.id; // Assuming user ID comes from auth middleware
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    // Build filter object
    const filter: any = { userId };
    
    if (type && (type === 'income' || type === 'expense')) {
      filter.type = type;
    }
    
    if (category) {
      filter.category = category;
    }
    
    if (account) {
      filter.account = account;
    }
    
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate as string);
      if (endDate) filter.date.$lte = new Date(endDate as string);
    }
    
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { notes: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    
    const transactions = await Transaction.find(filter)
      .populate('category', 'name color icon type')
      .populate('account', 'name type color')
      .sort({ date: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Transaction.countDocuments(filter);
    const pages = Math.ceil(total / Number(limit));

    res.json({
      transactions,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages
      }
    });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ message: 'Error fetching transactions' });
  }
};

// Get a single transaction by ID
export const getTransactionById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const transaction = await Transaction.findOne({ _id: id, userId })
      .populate('category', 'name color icon type')
      .populate('account', 'name type color');

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    res.json(transaction);
  } catch (error) {
    console.error('Error fetching transaction:', error);
    res.status(500).json({ message: 'Error fetching transaction' });
  }
};

// Create a new transaction
export const createTransaction = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const transactionData = { ...req.body, userId };

    // Validate category and account exist and belong to user
    const [category, account] = await Promise.all([
      Category.findOne({ _id: transactionData.category, userId }),
      Account.findOne({ _id: transactionData.account, userId })
    ]);

    if (!category) {
      return res.status(400).json({ message: 'Invalid category' });
    }

    if (!account) {
      return res.status(400).json({ message: 'Invalid account' });
    }

    // Validate transaction type matches category type
    if (category.type !== 'both' && category.type !== transactionData.type) {
      return res.status(400).json({ 
        message: `Category "${category.name}" is only for ${category.type} transactions` 
      });
    }

    const transaction = new Transaction(transactionData);
    await transaction.save();

    // Update account balance
    const balanceChange = transactionData.type === 'income' 
      ? transactionData.amount 
      : -transactionData.amount;
    
    await Account.findByIdAndUpdate(
      transactionData.account,
      { $inc: { currentBalance: balanceChange } }
    );

    const populatedTransaction = await Transaction.findById(transaction._id)
      .populate('category', 'name color icon type')
      .populate('account', 'name type color');

    res.status(201).json(populatedTransaction);
  } catch (error) {
    console.error('Error creating transaction:', error);
    res.status(500).json({ message: 'Error creating transaction' });
  }
};

// Update a transaction
export const updateTransaction = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const existingTransaction = await Transaction.findOne({ _id: id, userId });
    if (!existingTransaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    // If amount, type, or account changed, update account balances
    const updateData = req.body;
    if (updateData.amount !== undefined || updateData.type !== undefined || updateData.account !== undefined) {
      // Revert old transaction effect
      const oldBalanceChange = existingTransaction.type === 'income' 
        ? -existingTransaction.amount 
        : existingTransaction.amount;
      
      await Account.findByIdAndUpdate(
        existingTransaction.account,
        { $inc: { currentBalance: oldBalanceChange } }
      );

      // Apply new transaction effect
      const newAmount = updateData.amount ?? existingTransaction.amount;
      const newType = updateData.type ?? existingTransaction.type;
      const newAccount = updateData.account ?? existingTransaction.account;
      
      const newBalanceChange = newType === 'income' ? newAmount : -newAmount;
      
      await Account.findByIdAndUpdate(
        newAccount,
        { $inc: { currentBalance: newBalanceChange } }
      );
    }

    const updatedTransaction = await Transaction.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    )
      .populate('category', 'name color icon type')
      .populate('account', 'name type color');

    res.json(updatedTransaction);
  } catch (error) {
    console.error('Error updating transaction:', error);
    res.status(500).json({ message: 'Error updating transaction' });
  }
};

// Delete a transaction
export const deleteTransaction = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const transaction = await Transaction.findOne({ _id: id, userId });
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    // Revert transaction effect on account balance
    const balanceChange = transaction.type === 'income' 
      ? -transaction.amount 
      : transaction.amount;
    
    await Account.findByIdAndUpdate(
      transaction.account,
      { $inc: { currentBalance: balanceChange } }
    );

    await Transaction.findByIdAndDelete(id);

    res.json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    console.error('Error deleting transaction:', error);
    res.status(500).json({ message: 'Error deleting transaction' });
  }
};

// Get transaction statistics
export const getTransactionStats = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const { startDate, endDate } = req.query;
    const filter: any = { userId };
    
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate as string);
      if (endDate) filter.date.$lte = new Date(endDate as string);
    }

    const stats = await Transaction.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' },
          count: { $sum: 1 },
          avgAmount: { $avg: '$amount' }
        }
      }
    ]);

    const categoryStats = await Transaction.aggregate([
      { $match: filter },
      {
        $group: {
          _id: { category: '$category', type: '$type' },
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'categories',
          localField: '_id.category',
          foreignField: '_id',
          as: 'categoryInfo'
        }
      },
      {
        $unwind: '$categoryInfo'
      },
      {
        $project: {
          type: '$_id.type',
          category: '$categoryInfo.name',
          color: '$categoryInfo.color',
          total: 1,
          count: 1
        }
      }
    ]);

    res.json({
      overview: stats,
      byCategory: categoryStats
    });
  } catch (error) {
    console.error('Error fetching transaction stats:', error);
    res.status(500).json({ message: 'Error fetching transaction stats' });
  }
}; 