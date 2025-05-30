import { useForm } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNextLessonNumber } from '@/hooks/useLesson';
import { mmssToSeconds, secondsToMmss, isValidMmssFormat } from '@/utils/durationUtils';
import type { Lesson, CreateLesson } from '@/types';

const lessonSchema = z.object({
  lesson_number: z.number().min(1, 'Lesson number must be at least 1'),
  lesson_title: z.string().min(1, 'Lesson title is required').max(200, 'Lesson title is too long'),
  is_test: z.boolean(),
  is_doc: z.boolean(),
  is_completed: z.boolean(),
  due_date: z.string().min(1, 'Due date is required'),
  duration: z.string().refine((val) => !val || isValidMmssFormat(val), {
    message: 'Duration must be in MM:SS format (e.g., 05:30)'
  }).optional(),
});

type LessonFormData = z.infer<typeof lessonSchema>;

interface LessonFormProps {
  lesson?: Lesson;
  sectionId: string;
  onSubmit: (data: CreateLesson) => void;
  onCancel: () => void;
  isLoading?: boolean;
  submitLabel?: string;
}

export default function LessonForm({ 
  lesson, 
  sectionId,
  onSubmit, 
  onCancel, 
  isLoading = false,
  submitLabel = 'Save Lesson'
}: LessonFormProps) {
  const nextLessonNumber = useNextLessonNumber(sectionId);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<LessonFormData>({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      lesson_number: lesson?.lesson_number || nextLessonNumber,
      lesson_title: lesson?.lesson_title || '',
      is_test: lesson?.is_test || false,
      is_doc: lesson?.is_doc !== undefined ? lesson.is_doc : true,
      is_completed: lesson?.is_completed || false,
      due_date: lesson?.due_date ? new Date(lesson.due_date).toISOString().slice(0, 16) : '',
      duration: lesson?.duration ? secondsToMmss(lesson.duration) : '',
    },
  });

  const watchedValues = watch(['is_test', 'is_doc', 'is_completed']);
  const isContentLesson = !watchedValues[0] && !watchedValues[1]; // Not test and not doc

  const handleFormSubmit: SubmitHandler<LessonFormData> = (data) => {
    const submitData: CreateLesson = {
      ...data,
      due_date: new Date(data.due_date).toISOString(),
      section: sectionId,
      duration: data.duration ? mmssToSeconds(data.duration) : undefined,
    };
    onSubmit(submitData);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>
          {lesson ? 'Edit Lesson' : 'Create New Lesson'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="lesson_number">Lesson Number *</Label>
            <Input
              id="lesson_number"
              type="number"
              min="1"
              {...register('lesson_number', { valueAsNumber: true })}
              placeholder={`Auto-filled (${nextLessonNumber})`}
              className={errors.lesson_number ? 'border-red-500' : ''}
            />
            {errors.lesson_number && (
              <p className="text-sm text-red-500">{errors.lesson_number.message}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Auto-filled based on existing lessons, but you can change it
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="lesson_title">Lesson Title *</Label>
            <Input
              id="lesson_title"
              {...register('lesson_title')}
              placeholder="Enter lesson title"
              className={errors.lesson_title ? 'border-red-500' : ''}
            />
            {errors.lesson_title && (
              <p className="text-sm text-red-500">{errors.lesson_title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="due_date">Due Date *</Label>
            <Input
              id="due_date"
              type="datetime-local"
              {...register('due_date')}
              className={errors.due_date ? 'border-red-500' : ''}
            />
            {errors.due_date && (
              <p className="text-sm text-red-500">{errors.due_date.message}</p>
            )}
          </div>

          {isContentLesson && (
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (MM:SS)</Label>
              <Input
                id="duration"
                type="text"
                {...register('duration')}
                placeholder="Enter duration in MM:SS format (e.g., 05:30)"
                className={errors.duration ? 'border-red-500' : ''}
              />
              {errors.duration && (
                <p className="text-sm text-red-500">{errors.duration.message}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Duration for video lessons, interactive content, etc. Format: MM:SS (e.g., 05:30 for 5 minutes 30 seconds)
              </p>
            </div>
          )}

          <div className="space-y-4">
            <Label>Lesson Properties</Label>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_test"
                  checked={watchedValues[0]}
                  onCheckedChange={(checked) => setValue('is_test', checked === true)}
                />
                <Label htmlFor="is_test" className="text-sm font-normal">
                  This is a test lesson
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_doc"
                  checked={watchedValues[1]}
                  onCheckedChange={(checked) => setValue('is_doc', checked === true)}
                />
                <Label htmlFor="is_doc" className="text-sm font-normal">
                  This is a documentation lesson
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_completed"
                  checked={watchedValues[2]}
                  onCheckedChange={(checked) => setValue('is_completed', checked === true)}
                />
                <Label htmlFor="is_completed" className="text-sm font-normal">
                  Mark as completed
                </Label>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button 
              type="submit" 
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? 'Saving...' : submitLabel}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              disabled={isLoading}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
} 