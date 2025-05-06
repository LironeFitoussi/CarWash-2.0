import axiosInstance from './axiosInstance';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
}

const endpoint = '/api/v1/users';

// --- CRUD API functions ---
export const getAllUsers = async (): Promise<User[]> => {
  const { data } = await axiosInstance.get<User[]>(endpoint);
  return data;
};

// Get user by email
export const getUserByEmail = async (email: string): Promise<User> => {
  const { data } = await axiosInstance.get<User>(`${endpoint}/email/${email}`);
  return data;
};

// Create user
export const createUser = async (user: User): Promise<User> => {
  const { data } = await axiosInstance.post<User>(endpoint, user);
  return data;
};

// Update user
export const updateUser = async (user: User): Promise<User> => {
  const { data } = await axiosInstance.put<User>(`${endpoint}/${user.id}`, user);
  return data;
};



