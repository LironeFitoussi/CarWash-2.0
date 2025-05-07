import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';

export interface Event {
  _id: string;
  title: string;
  description: string;
  start: string;
  end: string;
  location?: string;
  createdAt: string;
  updatedAt: string;
  extendedProps: {
    type: string;
    isPickup: boolean;
    address?: string;
  }
}

export interface CreateEventInput {
  title: string;
  description: string;
  start: string;
  end: string;
  location?: string;
  extendedProps: {
    type: string;
    isPickup: boolean;
    address?: string;
  }
}

export type UpdateEventInput = Partial<CreateEventInput>;

export const eventsApi = {
  getAll: async (): Promise<Event[]> => {
    const response = await axios.get(`${API_URL}/events`);
    return response.data;
  },

  create: async (event: CreateEventInput): Promise<Event> => {
    const response = await axios.post(`${API_URL}/events`, event);
    return response.data;
  },

  update: async (id: string, event: UpdateEventInput): Promise<Event> => {
    const response = await axios.patch(`${API_URL}/events/${id}`, event);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await axios.delete(`${API_URL}/events/${id}`);
  },

  getICalendarUrl: (): string => {
    return `${API_URL}/calendar/admin.ics`;
  }
}; 