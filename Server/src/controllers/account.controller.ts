import { Request, Response } from 'express';
import Account from '../models/Account';

// Get all accounts for a user
export const getAccounts = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 50, type, isActive = 'true' } = req.query;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const filter: any = { userId };
    
    if (type && ['bank', 'credit_card', 'cash', 'investment', 'savings', 'loan', 'other'].includes(type as string)) {
      filter.type = type;
    }
    
    if (isActive !== 'all') {
      filter.isActive = isActive === 'true';
    }

    const skip = (Number(page) - 1) * Number(limit);
    
    const accounts = await Account.find(filter)
      .sort({ name: 1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Account.countDocuments(filter);
    const pages = Math.ceil(total / Number(limit));

    res.json({
      accounts,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages
      }
    });
  } catch (error) {
    console.error('Error fetching accounts:', error);
    res.status(500).json({ message: 'Error fetching accounts' });
  }
};

// Get a single account by ID
export const getAccountById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const account = await Account.findOne({ _id: id, userId });

    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }

    res.json(account);
  } catch (error) {
    console.error('Error fetching account:', error);
    res.status(500).json({ message: 'Error fetching account' });
  }
};

// Create a new account
export const createAccount = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const accountData = { ...req.body, userId };
    const account = new Account(accountData);
    await account.save();

    res.status(201).json(account);
  } catch (error: any) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Account name already exists' });
    }
    console.error('Error creating account:', error);
    res.status(500).json({ message: 'Error creating account' });
  }
};

// Update an account
export const updateAccount = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const updateData = req.body;

    // Don't allow updating currentBalance directly - it should be calculated from transactions
    if (updateData.currentBalance !== undefined) {
      delete updateData.currentBalance;
    }

    const updatedAccount = await Account.findOneAndUpdate(
      { _id: id, userId },
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedAccount) {
      return res.status(404).json({ message: 'Account not found' });
    }

    res.json(updatedAccount);
  } catch (error: any) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Account name already exists' });
    }
    console.error('Error updating account:', error);
    res.status(500).json({ message: 'Error updating account' });
  }
};

// Delete an account (soft delete by setting isActive to false)
export const deleteAccount = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const account = await Account.findOne({ _id: id, userId });
    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }

    // Check if account has transactions
    const Transaction = require('../models/Transaction').default;
    const transactionCount = await Transaction.countDocuments({ account: id });
    
    if (transactionCount > 0) {
      // Soft delete - just mark as inactive
      await Account.findByIdAndUpdate(id, { isActive: false });
      res.json({ message: 'Account deactivated successfully (has existing transactions)' });
    } else {
      // Hard delete if no transactions
      await Account.findByIdAndDelete(id);
      res.json({ message: 'Account deleted successfully' });
    }
  } catch (error) {
    console.error('Error deleting account:', error);
    res.status(500).json({ message: 'Error deleting account' });
  }
};

// Get account balance summary
export const getAccountSummary = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const accounts = await Account.find({ userId, isActive: true });
    
    const summary = {
      totalNetWorth: 0,
      totalAssets: 0,
      totalLiabilities: 0,
      accountsByType: {} as Record<string, { count: number; totalBalance: number; accounts: any[] }>
    };

    accounts.forEach(account => {
      const balance = account.currentBalance;
      
      if (account.includeInNetWorth) {
        summary.totalNetWorth += balance;
        
        if (account.type === 'loan' || account.type === 'credit_card') {
          summary.totalLiabilities += Math.abs(balance);
        } else {
          summary.totalAssets += balance;
        }
      }

      if (!summary.accountsByType[account.type]) {
        summary.accountsByType[account.type] = {
          count: 0,
          totalBalance: 0,
          accounts: []
        };
      }

      summary.accountsByType[account.type].count++;
      summary.accountsByType[account.type].totalBalance += balance;
      summary.accountsByType[account.type].accounts.push({
        _id: account._id,
        name: account.name,
        balance: account.currentBalance,
        color: account.color
      });
    });

    res.json(summary);
  } catch (error) {
    console.error('Error fetching account summary:', error);
    res.status(500).json({ message: 'Error fetching account summary' });
  }
};

// Recalculate account balance based on transactions
export const recalculateBalance = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const account = await Account.findOne({ _id: id, userId });
    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }

    const Transaction = require('../models/Transaction').default;
    
    // Calculate balance from initial balance + all transactions
    const transactions = await Transaction.find({ account: id, userId });
    
    let calculatedBalance = account.initialBalance;
    
    transactions.forEach((transaction: any) => {
      if (transaction.type === 'income') {
        calculatedBalance += transaction.amount;
      } else {
        calculatedBalance -= transaction.amount;
      }
    });

    // Update the account with calculated balance
    const updatedAccount = await Account.findByIdAndUpdate(
      id,
      { currentBalance: calculatedBalance },
      { new: true }
    );

    res.json({
      message: 'Balance recalculated successfully',
      account: updatedAccount,
      previousBalance: account.currentBalance,
      newBalance: calculatedBalance
    });
  } catch (error) {
    console.error('Error recalculating balance:', error);
    res.status(500).json({ message: 'Error recalculating balance' });
  }
}; 