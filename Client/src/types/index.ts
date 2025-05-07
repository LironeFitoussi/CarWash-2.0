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
  userId: string;
  title: string;
  start: string;
  end: string;
  location: string;
  description: string;
};