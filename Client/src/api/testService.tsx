import axiosInstance from './axiosInstance';

// Types (customize as needed)
export interface TestItem {
  id: string;
  // Add other fields as needed
  [key: string]: unknown;
}

export interface CreateTestItemDto {
  // Fields required to create a TestItem
  [key: string]: unknown;
}

export interface UpdateTestItemDto {
  // Fields required to update a TestItem
  [key: string]: unknown;
}

const endpoint = '/test';

// --- CRUD API functions ---
export const getAllTests = async (): Promise<TestItem[]> => {
  const { data } = await axiosInstance.get<TestItem[]>(endpoint);
  return data;
};

export const getTestById = async (id: string): Promise<TestItem> => {
  const { data } = await axiosInstance.get<TestItem>(`${endpoint}/${id}`);
  return data;
};

export const createTest = async (payload: CreateTestItemDto): Promise<TestItem> => {
  const { data } = await axiosInstance.post<TestItem>(endpoint, payload);
  return data;
};

export const updateTest = async ({ id, payload }: { id: string; payload: UpdateTestItemDto }): Promise<TestItem> => {
  const { data } = await axiosInstance.put<TestItem>(`${endpoint}/${id}`, payload);
  return data;
};

export const removeTest = async (id: string): Promise<void> => {
  await axiosInstance.delete(`${endpoint}/${id}`);
};

