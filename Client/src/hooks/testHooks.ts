import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { TestItem } from "@/api/testService";
import { getAllTests, getTestById, createTest, updateTest, removeTest } from "@/api/testService";


// --- TanStack Query hooks ---
export function useTests() {
    return useQuery<TestItem[], Error>({
      queryKey: ['tests'],
      queryFn: getAllTests,
    });
  }
  
  export function useTest(id: string) {
    return useQuery<TestItem, Error>({
      queryKey: ['tests', id],
      queryFn: () => getTestById(id),
      enabled: !!id,
    });
  }
  
  export function useCreateTest() {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: createTest,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['tests'] });
      },
    });
  }
  
  export function useUpdateTest() {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: updateTest,
      onSuccess: (_data, variables) => {
        queryClient.invalidateQueries({ queryKey: ['tests'] });
        if (variables && variables.id) {
          queryClient.invalidateQueries({ queryKey: ['tests', variables.id] });
        }
      },
    });
  }
  
  export function useRemoveTest() {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: removeTest,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['tests'] });
      },
    });
  }
  