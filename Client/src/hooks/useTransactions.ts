import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { transactionApi } from '@/services/api';
import type { CreateTransaction } from '@/types';
import { toast } from 'sonner';

// Query keys for consistent cache management
export const transactionKeys = {
  all: ['transactions'] as const,
  lists: () => [...transactionKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...transactionKeys.lists(), { filters }] as const,
  details: () => [...transactionKeys.all, 'detail'] as const,
  detail: (id: string) => [...transactionKeys.details(), id] as const,
  stats: (filters: Record<string, unknown>) => [...transactionKeys.all, 'stats', { filters }] as const,
};

// Hook to get all transactions with optional filters
export function useTransactions(params?: {
  page?: number;
  limit?: number;
  type?: 'income' | 'expense';
  category?: string;
  account?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
}) {
  return useQuery({
    queryKey: transactionKeys.list(params || {}),
    queryFn: () => transactionApi.getAll(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook to get a single transaction by ID
export function useTransaction(id: string, enabled = true) {
  return useQuery({
    queryKey: transactionKeys.detail(id),
    queryFn: () => transactionApi.getById(id),
    enabled: enabled && !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Hook to get transaction statistics
export function useTransactionStats(params?: {
  startDate?: string;
  endDate?: string;
  groupBy?: 'day' | 'week' | 'month' | 'year';
}) {
  return useQuery({
    queryKey: transactionKeys.stats(params || {}),
    queryFn: () => transactionApi.getStats(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook to create a new transaction
export function useCreateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTransaction) => transactionApi.create(data),
    onSuccess: (newTransaction) => {
      // Invalidate and refetch transaction lists
      queryClient.invalidateQueries({ queryKey: transactionKeys.lists() });
      // Invalidate stats as they depend on transactions
      queryClient.invalidateQueries({ queryKey: transactionKeys.all });
      // Optimistically add to cache
      queryClient.setQueryData(
        transactionKeys.detail(newTransaction._id),
        newTransaction
      );
      toast.success('Transaction added successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to add transaction');
    },
  });
}

// Hook to update a transaction
export function useUpdateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateTransaction> }) =>
      transactionApi.update(id, data),
    onSuccess: (updatedTransaction) => {
      // Update the specific transaction in cache
      queryClient.setQueryData(
        transactionKeys.detail(updatedTransaction._id),
        updatedTransaction
      );
      // Invalidate lists to ensure consistency
      queryClient.invalidateQueries({ queryKey: transactionKeys.lists() });
      // Invalidate stats
      queryClient.invalidateQueries({ queryKey: transactionKeys.all });
      toast.success('Transaction updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update transaction');
    },
  });
}

// Hook to delete a transaction
export function useDeleteTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => transactionApi.delete(id),
    onSuccess: (_, deletedId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: transactionKeys.detail(deletedId) });
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: transactionKeys.lists() });
      // Invalidate stats
      queryClient.invalidateQueries({ queryKey: transactionKeys.all });
      toast.success('Transaction deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete transaction');
    },
  });
}

// Helper hook for income transactions
export function useIncomeTransactions(params?: Omit<Parameters<typeof useTransactions>[0], 'type'>) {
  return useTransactions({ ...params, type: 'income' });
}

// Helper hook for expense transactions
export function useExpenseTransactions(params?: Omit<Parameters<typeof useTransactions>[0], 'type'>) {
  return useTransactions({ ...params, type: 'expense' });
} 