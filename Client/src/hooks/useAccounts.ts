import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { accountApi } from '@/services/api';
import type { CreateAccount } from '@/types';
import { toast } from 'sonner';

// Query keys for consistent cache management
export const accountKeys = {
  all: ['accounts'] as const,
  lists: () => [...accountKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...accountKeys.lists(), { filters }] as const,
  details: () => [...accountKeys.all, 'detail'] as const,
  detail: (id: string) => [...accountKeys.details(), id] as const,
  summary: () => [...accountKeys.all, 'summary'] as const,
};

// Hook to get all accounts
export function useAccounts() {
  return useQuery({
    queryKey: accountKeys.lists(),
    queryFn: async () => {
      const response = await accountApi.getAll();
      return response.accounts; // Extract accounts array from paginated response
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook to get a single account by ID
export function useAccount(id: string, enabled = true) {
  return useQuery({
    queryKey: accountKeys.detail(id),
    queryFn: () => accountApi.getById(id),
    enabled: enabled && !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook to get account summary
export function useAccountSummary() {
  return useQuery({
    queryKey: accountKeys.summary(),
    queryFn: () => accountApi.getSummary(),
    staleTime: 2 * 60 * 1000, // 2 minutes - balances can change frequently
  });
}

// Hook to create a new account
export function useCreateAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAccount) => accountApi.create(data),
    onSuccess: (newAccount) => {
      // Invalidate and refetch account lists
      queryClient.invalidateQueries({ queryKey: accountKeys.lists() });
      // Invalidate summary
      queryClient.invalidateQueries({ queryKey: accountKeys.summary() });
      // Optimistically add to cache
      queryClient.setQueryData(
        accountKeys.detail(newAccount._id),
        newAccount
      );
      toast.success('Account created successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create account');
    },
  });
}

// Hook to update an account
export function useUpdateAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateAccount> }) =>
      accountApi.update(id, data),
    onSuccess: (updatedAccount) => {
      // Update the specific account in cache
      queryClient.setQueryData(
        accountKeys.detail(updatedAccount._id),
        updatedAccount
      );
      // Invalidate lists to ensure consistency
      queryClient.invalidateQueries({ queryKey: accountKeys.lists() });
      // Invalidate summary
      queryClient.invalidateQueries({ queryKey: accountKeys.summary() });
      toast.success('Account updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update account');
    },
  });
}

// Hook to delete an account
export function useDeleteAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => accountApi.delete(id),
    onSuccess: (_, deletedId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: accountKeys.detail(deletedId) });
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: accountKeys.lists() });
      // Invalidate summary
      queryClient.invalidateQueries({ queryKey: accountKeys.summary() });
      toast.success('Account deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete account');
    },
  });
}

// Hook to recalculate account balance
export function useRecalculateAccountBalance() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => accountApi.recalculateBalance(id),
    onSuccess: (updatedAccount) => {
      // Update the specific account in cache
      queryClient.setQueryData(
        accountKeys.detail(updatedAccount._id),
        updatedAccount
      );
      // Invalidate lists and summary
      queryClient.invalidateQueries({ queryKey: accountKeys.lists() });
      queryClient.invalidateQueries({ queryKey: accountKeys.summary() });
      toast.success('Account balance recalculated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to recalculate account balance');
    },
  });
} 