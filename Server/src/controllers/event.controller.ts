import { Request, Response } from 'express';
import Event from '../models/Event';
import { createEvents, EventAttributes } from 'ics';

export const getAllEvents = async (req: Request, res: Response) => {
  try {
    const events = await Event.find().sort({ start: 1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch events' });
  }
};

export const createEvent = async (req: Request, res: Response) => {
  try {
    const { title, description, start, end, location, extendedProps } = req.body;
    const event = await Event.create({
      title,
      description,
      start: new Date(start),
      end: new Date(end),
      location,
      extendedProps,
    });
    res.status(201).json(event);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Invalid event data' });
  }
};

export const updateEvent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, start, end, location } = req.body;
    
    const updatedEvent = await Event.findByIdAndUpdate(
      id,
      {
        ...(title && { title }),
        ...(description && { description }),
        ...(start && { start: new Date(start) }),
        ...(end && { end: new Date(end) }),
        ...(location && { location }),
      },
      { new: true }
    );

    if (!updatedEvent) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.json(updatedEvent);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update event' });
  }
};

export const deleteEvent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await Event.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete event' });
  }
};

export const getICalendarFeed = async (req: Request, res: Response) => {
  try {
    const events = await Event.find().sort({ start: 1 });
    
    const icsEvents: EventAttributes[] = events.map(event => ({
      start: [
        event.start.getFullYear(),
        event.start.getMonth() + 1,
        event.start.getDate(),
        event.start.getHours(),
        event.start.getMinutes()
      ] as [number, number, number, number, number],
      end: [
        event.end.getFullYear(),
        event.end.getMonth() + 1,
        event.end.getDate(),
        event.end.getHours(),
        event.end.getMinutes()
      ] as [number, number, number, number, number],
      title: event.title,
      description: event.description,
      location: event.location,
      url: `http://localhost:3001/admin/calendar?event=${event._id}`
    }));

    createEvents(icsEvents, (error, value) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to generate calendar' });
      }

      res.set('Content-Type', 'text/calendar');
      res.set('Content-Disposition', 'attachment; filename="admin.ics"');
      res.send(value);
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate calendar' });
  }
};