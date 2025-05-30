import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import LessonForm from './LessonForm';
import { useCreateLesson, useUpdateLesson } from '@/hooks/useLesson';
import type { Lesson, CreateLesson } from '@/types';

interface LessonModalProps {
  isOpen: boolean;
  onClose: () => void;
  sectionId: string;
  lesson?: Lesson;
  onSuccess?: () => void;
}

export default function LessonModal({ 
  isOpen, 
  onClose, 
  sectionId,
  lesson,
  onSuccess
}: LessonModalProps) {
  const createLesson = useCreateLesson({
    onSuccess: () => {
      onClose();
      onSuccess?.();
    }
  });

  const updateLesson = useUpdateLesson({
    onSuccess: () => {
      onClose();
      onSuccess?.();
    }
  });

  const isLoading = createLesson.isPending || updateLesson.isPending;

  const handleSubmit = (data: CreateLesson) => {
    if (lesson) {
      updateLesson.mutate({ ...data, id: lesson._id });
    } else {
      createLesson.mutate({ sectionId, lesson: data });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {lesson ? 'Edit Lesson' : 'Create New Lesson'}
          </DialogTitle>
        </DialogHeader>
        <LessonForm
          lesson={lesson}
          sectionId={sectionId}
          onSubmit={handleSubmit}
          onCancel={onClose}
          isLoading={isLoading}
          submitLabel={lesson ? 'Update Lesson' : 'Create Lesson'}
        />
      </DialogContent>
    </Dialog>
  );
} 