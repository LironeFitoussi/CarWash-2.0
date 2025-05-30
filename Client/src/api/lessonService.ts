import axiosInstance from './axiosInstance';
import type {
  Lesson,
  CreateLesson,
  UpdateLesson,
  LessonsResponse
} from '@/types';

const endpoint = '/lessons';

// --- Lesson CRUD operations ---
export const getLessonsBySection = async (sectionId: string, params?: {
  page?: number;
  limit?: number;
}): Promise<LessonsResponse> => {
  const { data } = await axiosInstance.get<LessonsResponse>(`${endpoint}/section/${sectionId}`, { params });
  return data;
};

export const getLessonById = async (id: string): Promise<Lesson> => {
  const { data } = await axiosInstance.get<Lesson>(`${endpoint}/${id}`);
  return data;
};

export const createLesson = async (sectionId: string, lesson: CreateLesson): Promise<Lesson> => {
  const { data } = await axiosInstance.post<Lesson>(`${endpoint}/section/${sectionId}`, lesson);
  return data;
};

export const updateLesson = async ({ id, ...lesson }: UpdateLesson & { id: string }): Promise<Lesson> => {
  const { data } = await axiosInstance.put<Lesson>(`${endpoint}/${id}`, lesson);
  return data;
};

export const deleteLesson = async (id: string): Promise<{ message: string }> => {
  const { data } = await axiosInstance.delete<{ message: string }>(`${endpoint}/${id}`);
  return data;
};

export const markLessonCompleted = async (
  id: string,
  is_completed: boolean = true
): Promise<{ message: string; lesson: Lesson }> => {
  const { data } = await axiosInstance.patch<{ message: string; lesson: Lesson }>(
    `${endpoint}/${id}/complete`,
    { is_completed }
  );
  return data;
}; 