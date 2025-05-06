import express, { Router, RequestHandler } from 'express';
import { getAllEvents, createEvent, updateEvent, deleteEvent, getICalendarFeed } from '../controllers/eventController';

const router: Router = express.Router();

// Event CRUD endpoints
router.get('/events', getAllEvents as RequestHandler);
router.post('/events', createEvent as RequestHandler);
router.patch('/events/:id', updateEvent as RequestHandler);
router.delete('/events/:id', deleteEvent as RequestHandler);

// iCalendar feed endpoint
router.get('/calendar/admin.ics', getICalendarFeed as RequestHandler);

export default router; 