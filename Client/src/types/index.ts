export type User = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  role: string;
};

export type NewAppointment = {
  title: string;
  start: string;
  end: string;
  location: string;
  description: string;
  extendedProps: {
    type: string;
    userId: string;
    isPickup?: boolean;
    address?: string;
  };
};

export type CreateUser = Omit<User, '_id'>;

export type Event = {
  _id: string;
  userId?: string;
  title: string;
  description: string;
  start: string;
  end: string;
};

export type CreateEvent = Omit<Event, '_id'>;
