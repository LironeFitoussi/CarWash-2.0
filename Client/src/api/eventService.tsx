import axiosInstance from './axiosInstance';

import type { Event, CreateEventInput } from '@/api/events';

const endpoint = '/api/v1/events';

// --- CRUD API functions ---
export const getAllEvents = async (): Promise<Event[]> => {
  const { data } = await axiosInstance.get<Event[]>(endpoint);
  return data;
};

// Get event by id
export const getEventById = async (id: string): Promise<Event> => {
  const { data } = await axiosInstance.get<Event>(`${endpoint}/${id}`);
  return data;
};

// Create event
export const createEvent = async (event: CreateEventInput): Promise<Event> => {
  console.log("Creating event")
  console.log(event)
  const { data } = await axiosInstance.post<Event>(endpoint, event);
  return data;
};

// Update event
export const updateEvent = async (event: Event): Promise<Event> => {
  const { data } = await axiosInstance.patch<Event>(`${endpoint}/${event._id}`, event);
  return data;
};

// Delete event
export const deleteEvent = async (id: string): Promise<void> => {
  await axiosInstance.delete(`${endpoint}/${id}`);
};









