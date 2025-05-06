import mongoose, { Schema, Document } from 'mongoose';

export interface Event extends Document {
  title: string;
  description: string;
  start: Date;
  end: Date;
  location?: string;
  createdAt: Date;
  updatedAt: Date;
}

const eventSchema = new Schema<Event>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    start: { type: Date, required: true },
    end: { type: Date, required: true },
    location: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<Event>('Event', eventSchema); 