export type User = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  role: string;
};

export type CreateUser = Omit<User, '_id'>;

export type Event = {
  _id: string;
  userId?: string;
  title: string;
  description: string;
  start: string;
  end: string;
};

export type CreateEvent = Omit<Event, '_id'>;

// Transaction Types
export interface Transaction {
  _id: string;
  title: string;
  description?: string;
  amount: number;
  type: 'income' | 'expense';
  category: string | Category;
  account: string | Account;
  date: string;
  recurring?: {
    isRecurring: boolean;
    frequency?: 'daily' | 'weekly' | 'monthly' | 'yearly';
    endDate?: string;
  };
  tags?: string[];
  attachments?: string[];
  location?: string;
  notes?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTransaction {
  title: string;
  description?: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  account: string;
  date: string;
  recurring?: {
    isRecurring: boolean;
    frequency?: 'daily' | 'weekly' | 'monthly' | 'yearly';
    endDate?: string;
  };
  tags?: string[];
  attachments?: string[];
  location?: string;
  notes?: string;
}

export interface UpdateTransaction extends Partial<CreateTransaction> {}

// Category Types
export interface Category {
  _id: string;
  name: string;
  description?: string;
  type: 'income' | 'expense' | 'both';
  color: string;
  icon?: string;
  parentCategory?: string | Category;
  isActive: boolean;
  monthlyBudget?: number;
  userId: string;
  createdAt: string;
  updatedAt: string;
  subcategories?: Category[];
}

export interface CreateCategory {
  name: string;
  description?: string;
  type: 'income' | 'expense' | 'both';
  color: string;
  icon?: string;
  parentCategory?: string;
  monthlyBudget?: number;
}

export interface UpdateCategory extends Partial<CreateCategory> {}

// Account Types
export interface Account {
  _id: string;
  name: string;
  description?: string;
  type: 'bank' | 'credit_card' | 'cash' | 'investment' | 'savings' | 'loan' | 'other';
  currency: string;
  initialBalance: number;
  currentBalance: number;
  color: string;
  icon?: string;
  accountNumber?: string;
  bankName?: string;
  isActive: boolean;
  includeInNetWorth: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAccount {
  name: string;
  description?: string;
  type: 'bank' | 'credit_card' | 'cash' | 'investment' | 'savings' | 'loan' | 'other';
  currency: string;
  initialBalance: number;
  color: string;
  icon?: string;
  accountNumber?: string;
  bankName?: string;
  includeInNetWorth?: boolean;
}

export interface UpdateAccount extends Partial<CreateAccount> {}

// Budget Types
export interface Budget {
  _id: string;
  name: string;
  description?: string;
  category: string | Category;
  amount: number;
  period: 'monthly' | 'yearly';
  startDate: string;
  endDate: string;
  isActive: boolean;
  alertThreshold: number;
  currentSpent: number;
  notifications: {
    onThresholdReached: boolean;
    onBudgetExceeded: boolean;
    weeklyReport: boolean;
  };
  userId: string;
  createdAt: string;
  updatedAt: string;
  // Virtual fields
  percentageUsed?: number;
  remainingAmount?: number;
  isOverBudget?: boolean;
  isThresholdReached?: boolean;
}

export interface CreateBudget {
  name: string;
  description?: string;
  category: string;
  amount: number;
  period: 'monthly' | 'yearly';
  startDate: string;
  endDate: string;
  alertThreshold?: number;
  notifications?: {
    onThresholdReached: boolean;
    onBudgetExceeded: boolean;
    weeklyReport: boolean;
  };
}

export interface UpdateBudget extends Partial<CreateBudget> {}

// Response Types
export type TransactionsResponse = {
  transactions: Transaction[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
};

export type CategoriesResponse = {
  categories: Category[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
};

export type AccountsResponse = {
  accounts: Account[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
};

export type BudgetsResponse = {
  budgets: Budget[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
};

// Statistics Types
export type TransactionStats = {
  overview: Array<{
    _id: 'income' | 'expense';
    total: number;
    count: number;
    avgAmount: number;
  }>;
  byCategory: Array<{
    type: 'income' | 'expense';
    category: string;
    color: string;
    total: number;
    count: number;
  }>;
};

export type AccountSummary = {
  totalNetWorth: number;
  totalAssets: number;
  totalLiabilities: number;
  accountsByType: Record<string, {
    count: number;
    totalBalance: number;
    accounts: Array<{
      _id: string;
      name: string;
      balance: number;
      color: string;
    }>;
  }>;
};

export type BudgetSummary = {
  totalBudgeted: number;
  totalSpent: number;
  totalRemaining: number;
  budgetsOverLimit: number;
  budgetsNearLimit: number;
  budgetPerformance: Array<{
    budgetId: string;
    name: string;
    category: Category;
    amount: number;
    spent: number;
    remaining: number;
    percentageUsed: number;
    isOverBudget: boolean;
    isNearLimit: boolean;
  }>;
};
