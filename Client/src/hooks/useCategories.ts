import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoryApi } from '@/services/api';
import type { CreateCategory } from '@/types';
import { toast } from 'sonner';

// Query keys for consistent cache management
export const categoryKeys = {
  all: ['categories'] as const,
  lists: () => [...categoryKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...categoryKeys.lists(), { filters }] as const,
  details: () => [...categoryKeys.all, 'detail'] as const,
  detail: (id: string) => [...categoryKeys.details(), id] as const,
  stats: (filters: Record<string, unknown>) => [...categoryKeys.all, 'stats', { filters }] as const,
};

// Hook to get all categories
export function useCategories() {
  return useQuery({
    queryKey: categoryKeys.lists(),
    queryFn: async () => {
      const response = await categoryApi.getAll();
      return response.categories; // Extract categories array from paginated response
    },
    staleTime: 10 * 60 * 1000, // 10 minutes - categories don't change often
  });
}

// Hook to get a single category by ID
export function useCategory(id: string, enabled = true) {
  return useQuery({
    queryKey: categoryKeys.detail(id),
    queryFn: () => categoryApi.getById(id),
    enabled: enabled && !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Hook to get category statistics
export function useCategoryStats(params?: {
  startDate?: string;
  endDate?: string;
}) {
  return useQuery({
    queryKey: categoryKeys.stats(params || {}),
    queryFn: () => categoryApi.getStats(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook to create a new category
export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCategory) => categoryApi.create(data),
    onSuccess: (newCategory) => {
      // Invalidate and refetch category lists
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
      // Optimistically add to cache
      queryClient.setQueryData(
        categoryKeys.detail(newCategory._id),
        newCategory
      );
      toast.success('Category created successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create category');
    },
  });
}

// Hook to update a category
export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateCategory> }) =>
      categoryApi.update(id, data),
    onSuccess: (updatedCategory) => {
      // Update the specific category in cache
      queryClient.setQueryData(
        categoryKeys.detail(updatedCategory._id),
        updatedCategory
      );
      // Invalidate lists to ensure consistency
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
      toast.success('Category updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update category');
    },
  });
}

// Hook to delete a category
export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => categoryApi.delete(id),
    onSuccess: (_, deletedId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: categoryKeys.detail(deletedId) });
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
      toast.success('Category deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete category');
    },
  });
} 