import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { createEvent, getAllEvents, updateEvent, deleteEvent } from '@/api/eventService';

export const useGetAllEvents = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['events'],
    queryFn: getAllEvents,
  });

  return {
    data,
    isLoading,
    error,
  };
};

export const useCreateEvent = (options?: { onSuccess?: () => void }) => {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: createEvent,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['events'] });
        options?.onSuccess?.();
      },
    });
  };

export const useUpdateEvent = (options?: { onSuccess?: () => void }) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      options?.onSuccess?.();
    },
  });
};

export const useDeleteEvent = (options?: { onSuccess?: () => void }) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      options?.onSuccess?.();
    },
  });
};


