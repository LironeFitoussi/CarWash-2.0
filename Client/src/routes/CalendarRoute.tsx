import { useEffect, useState } from 'react';
import type { ChangeEvent } from 'react';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import type { DateSelectArg, EventClickArg } from '@fullcalendar/core';
import type { EventResizeStopArg, EventDragStopArg } from '@fullcalendar/interaction';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { eventsApi } from '@/api/events';
import type { Event, CreateEventInput } from '@/api/events';
import { useMediaQuery } from '@/hooks/useMediaQuery';

const formatDateForInput = (date: string) => {
  const israelDate = new Date(date).toLocaleString('en-US', { timeZone: 'Asia/Jerusalem' });
  return new Date(israelDate).toISOString().slice(0, 16);
};

const toIsraelTime = (date: Date): Date => {
  const israelDate = new Date(date.toLocaleString('en-US', { timeZone: 'Asia/Jerusalem' }));
  return israelDate;
};

export default function CalendarRoute() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [formData, setFormData] = useState<CreateEventInput>({
    title: '',
    description: '',
    start: '',
    end: '',
    location: '',
  });

  const loadEvents = async () => {
    try {
      const data = await eventsApi.getAll();
      const eventsWithTimezone = data.map(event => ({
        ...event,
        start: toIsraelTime(new Date(event.start)).toISOString(),
        end: toIsraelTime(new Date(event.end)).toISOString()
      }));
      setEvents(eventsWithTimezone);
    } catch (error) {
      toast.error('Failed to load events');
      console.error('Failed to load events:', error);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    setFormData({
      title: '',
      description: '',
      start: formatDateForInput(selectInfo.startStr),
      end: formatDateForInput(selectInfo.endStr),
      location: '',
    });
    setSelectedEvent(null);
    setIsModalOpen(true);
  };

  const handleEventClick = (clickInfo: EventClickArg) => {
    const event = events.find(e => e._id === clickInfo.event.id);
    if (event) {
      setSelectedEvent(event);
      setFormData({
        title: event.title,
        description: event.description,
        start: formatDateForInput(event.start),
        end: formatDateForInput(event.end),
        location: event.location || '',
      });
      setIsModalOpen(true);
    }
  };

  const handleEventDrop = async (dropInfo: EventDragStopArg) => {
    const event = events.find(e => e._id === dropInfo.event.id);
    if (!event) return;

    try {
      await eventsApi.update(event._id, {
        start: dropInfo.event.startStr,
        end: dropInfo.event.endStr,
      });
      await loadEvents();
    } catch (error) {
      toast.error('Failed to update event');
      console.error('Failed to update event:', error);
      dropInfo.event.setDates(event.start, event.end);
    }
  };

  const handleEventResize = async (resizeInfo: EventResizeStopArg) => {
    const event = events.find(e => e._id === resizeInfo.event.id);
    if (!event) return;

    try {
      await eventsApi.update(event._id, {
        start: resizeInfo.event.startStr,
        end: resizeInfo.event.endStr,
      });
      await loadEvents();
    } catch (error) {
      toast.error('Failed to update event');
      console.error('Failed to update event:', error);
      resizeInfo.event.setDates(event.start, event.end);
    }
  };

  const handleSubmit = async () => {
    try {
      if (selectedEvent) {
        await eventsApi.update(selectedEvent._id, formData);
        toast.success('Event updated successfully');
      } else {
        await eventsApi.create(formData);
        toast.success('Event created successfully');
      }
      setIsModalOpen(false);
      loadEvents();
    } catch (error) {
      toast.error('Failed to save event');
      console.error('Failed to save event:', error);
    }
  };

  const handleDelete = async () => {
    if (!selectedEvent) return;
    try {
      await eventsApi.delete(selectedEvent._id);
      toast.success('Event deleted successfully');
      setIsModalOpen(false);
      loadEvents();
    } catch (error) {
      toast.error('Failed to delete event');
      console.error('Failed to delete event:', error);
    }
  };

  const copyICalendarUrl = () => {
    const url = eventsApi.getICalendarUrl();
    navigator.clipboard.writeText(url);
    toast.success('Calendar URL copied to clipboard');
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Calendar</h1>
        <Button onClick={copyICalendarUrl}>
          Copy iCalendar URL
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <FullCalendar
          plugins={[timeGridPlugin, interactionPlugin]}
          initialView={isMobile ? 'timeGridDay' : 'timeGridWeek'}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: isMobile ? '' : 'timeGridWeek',
          }}
          timeZone="Asia/Jerusalem"
          editable={true}
          selectable={true}
          selectMirror={true}
          slotMinTime="06:00:00"
          slotMaxTime="22:00:00"
          allDaySlot={false}
          snapDuration="00:15:00"
          events={events.map(event => ({
            id: event._id,
            title: event.title,
            start: event.start,
            end: event.end,
            description: event.description,
            location: event.location
          }))}
          select={handleDateSelect}
          eventClick={handleEventClick}
          eventResize={handleEventResize}
          eventDrop={handleEventDrop}
          height="auto"
          slotEventOverlap={false}
          eventOverlap={false}
          forceEventDuration={true}
        />
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedEvent ? 'Edit Event' : 'New Event'}</DialogTitle>
            <DialogDescription>
              Fill in the event details below
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input
              placeholder="Event title"
              value={formData.title}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, title: e.target.value })}
            />
            <Textarea
              placeholder="Event description"
              value={formData.description}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, description: e.target.value })}
            />
            <Input
              type="datetime-local"
              value={formData.start}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, start: e.target.value })}
            />
            <Input
              type="datetime-local"
              value={formData.end}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, end: e.target.value })}
            />
            <Input
              placeholder="Location"
              value={formData.location}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, location: e.target.value })}
            />
          </div>
          <DialogFooter className="flex justify-between">
            {selectedEvent && (
              <Button variant="destructive" onClick={handleDelete}>
                Delete
              </Button>
            )}
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmit}>
                {selectedEvent ? 'Update' : 'Create'}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 