import mongoose, { Schema, Document } from 'mongoose';

interface ExtendedProps {
  type: string;
  isPickup: boolean | undefined;
  address: string | undefined;
  carId: string | undefined;
  carType: string | undefined;
  userId: string | undefined;
}
export interface Event extends Document {
  title: string;
  description: string;
  start: Date;
  end: Date;
  location?: string;
  createdAt: Date;
  updatedAt: Date;
  extendedProps: ExtendedProps;
  status: string | undefined;
}

// ExtendedProps Schema
const extendedPropsSchema = new Schema<ExtendedProps>({
  type: { type: String, required: true, enum: ['appointment', 'availability'] },
  isPickup: { type: Boolean, default: false },
  address: { type: String },
  carId: { type: String },
  carType: { type: String, enum: ['big', 'medium', 'small', 'motorcycle'] },
  userId: { type: String },
});

// Event Schema
const eventSchema = new Schema<Event>(
  {
    title: { type: String, required: true },
    description: { type: String},
    start: { type: Date, required: true },
    end: { type: Date, required: true },
    location: { type: String },
    extendedProps: { type: extendedPropsSchema, required: true },
    status: { type: String, enum: ['pending', 'confirmed', 'cancelled', 'completed'], default: 'pending' },
  },
  { timestamps: true }
);

// Remove the status field while extendedProps->type is availability while creating a new event
eventSchema.pre('save', function (next) {
  if (this.extendedProps.type === 'availability') {
    this.status = undefined;
    this.extendedProps.carId = undefined;
    this.extendedProps.carType = undefined;
    this.extendedProps.isPickup = undefined;
    this.extendedProps.userId = undefined;
    this.extendedProps.address = undefined;
  } else if (this.extendedProps.type === 'appointment') {
    // make sure userId is set
    if (!this.extendedProps.userId) {
      throw new Error('userId is required for appointment');
    }
  }
  next();
});


export default mongoose.model<Event>('Event', eventSchema); 