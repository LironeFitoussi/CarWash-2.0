import type { Transaction, CreateTransaction, Category, CreateCategory, Account, CreateAccount, Budget, CreateBudget, TransactionStats, AccountSummary, BudgetSummary, TransactionsResponse } from '@/types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

// Auth0 token getter - this will be set by the app
let getAccessToken: (() => Promise<string>) | null = null;

export const setTokenGetter = (tokenGetter: () => Promise<string>) => {
  getAccessToken = tokenGetter;
};

// Generic API call function with error handling
async function apiCall<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  let token = '';
  
  // Get token from Auth0
  if (getAccessToken) {
    try {
      token = await getAccessToken();
    } catch (error) {
      console.error('Failed to get access token:', error);
      throw new Error('Authentication required');
    }
  }
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  
  return response.json();
}

// Transaction API
export const transactionApi = {
  // Get all transactions with optional filters
  getAll: (params?: {
    page?: number;
    limit?: number;
    type?: 'income' | 'expense';
    category?: string;
    account?: string;
    startDate?: string;
    endDate?: string;
    search?: string;
  }) => {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          searchParams.append(key, value.toString());
        }
      });
    }
    const queryString = searchParams.toString();
    return apiCall<TransactionsResponse>(`/transactions${queryString ? `?${queryString}` : ''}`);
  },

  // Get transaction by ID
  getById: (id: string) => 
    apiCall<Transaction>(`/transactions/${id}`),

  // Create new transaction
  create: (data: CreateTransaction) =>
    apiCall<Transaction>('/transactions', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Update transaction
  update: (id: string, data: Partial<CreateTransaction>) =>
    apiCall<Transaction>(`/transactions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  // Delete transaction
  delete: (id: string) =>
    apiCall<{ message: string }>(`/transactions/${id}`, {
      method: 'DELETE',
    }),

  // Get transaction statistics
  getStats: (params?: {
    startDate?: string;
    endDate?: string;
    groupBy?: 'day' | 'week' | 'month' | 'year';
  }) => {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          searchParams.append(key, value.toString());
        }
      });
    }
    const queryString = searchParams.toString();
    return apiCall<TransactionStats>(`/transactions/stats${queryString ? `?${queryString}` : ''}`);
  },
};

// Category API
export const categoryApi = {
  // Get all categories
  getAll: () => 
    apiCall<{ categories: Category[]; pagination: { page: number; limit: number; total: number; pages: number } }>('/categories'),

  // Get category by ID
  getById: (id: string) => 
    apiCall<Category>(`/categories/${id}`),

  // Create new category
  create: (data: CreateCategory) =>
    apiCall<Category>('/categories', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Update category
  update: (id: string, data: Partial<CreateCategory>) =>
    apiCall<Category>(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  // Delete category (soft delete)
  delete: (id: string) =>
    apiCall<{ message: string }>(`/categories/${id}`, {
      method: 'DELETE',
    }),

  // Get category statistics
  getStats: (params?: {
    startDate?: string;
    endDate?: string;
  }) => {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          searchParams.append(key, value.toString());
        }
      });
    }
    const queryString = searchParams.toString();
    return apiCall<{ totalSpent: number; categoryBreakdown: Array<{ category: Category; spent: number; transactionCount: number }> }>(`/categories/stats${queryString ? `?${queryString}` : ''}`);
  },
};

// Account API
export const accountApi = {
  // Get all accounts
  getAll: () => 
    apiCall<{ accounts: Account[]; pagination: { page: number; limit: number; total: number; pages: number } }>('/accounts'),

  // Get account by ID
  getById: (id: string) => 
    apiCall<Account>(`/accounts/${id}`),

  // Create new account
  create: (data: CreateAccount) =>
    apiCall<Account>('/accounts', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Update account
  update: (id: string, data: Partial<CreateAccount>) =>
    apiCall<Account>(`/accounts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  // Delete account
  delete: (id: string) =>
    apiCall<{ message: string }>(`/accounts/${id}`, {
      method: 'DELETE',
    }),

  // Get account summary
  getSummary: () =>
    apiCall<AccountSummary>('/accounts/summary'),

  // Recalculate account balance
  recalculateBalance: (id: string) =>
    apiCall<Account>(`/accounts/${id}/recalculate`, {
      method: 'POST',
    }),
};

// Budget API
export const budgetApi = {
  // Get all budgets
  getAll: () => 
    apiCall<Budget[]>('/budgets'),

  // Get budget by ID
  getById: (id: string) => 
    apiCall<Budget>(`/budgets/${id}`),

  // Create new budget
  create: (data: CreateBudget) =>
    apiCall<Budget>('/budgets', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Update budget
  update: (id: string, data: Partial<CreateBudget>) =>
    apiCall<Budget>(`/budgets/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  // Delete budget
  delete: (id: string) =>
    apiCall<{ message: string }>(`/budgets/${id}`, {
      method: 'DELETE',
    }),

  // Get budget summary
  getSummary: () =>
    apiCall<BudgetSummary>('/budgets/summary'),

  // Update spent amount for budget
  updateSpent: (id: string) =>
    apiCall<Budget>(`/budgets/${id}/update-spent`, {
      method: 'POST',
    }),
};

// Export all APIs
export default {
  transactions: transactionApi,
  categories: categoryApi,
  accounts: accountApi,
  budgets: budgetApi,
}; 