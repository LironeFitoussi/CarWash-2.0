// @ts-expect-error: No type definitions for 'react-big-calendar'
import React, { useState, useEffect } from "react";
import { Calendar, dateFnsLocalizer, Views } from "react-big-calendar";
// @ts-expect-error: No type definitions for 'react-big-calendar/lib/addons/dragAndDrop'
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale/en-US";
import { useGetAllEvents, useUpdateEvent } from "@/hooks/useEvent";
import type { Event as ApiEvent } from "@/api/events";

// Components
// Organisms
import EventCell from "@/components/Organisms/EventCell";
import type { CreateEventInput } from "@/components/Organisms/NewEventModal";
import NewEventModal from "@/components/Organisms/NewEventModal";

// Molecules
import { AppointmentCard } from "@/components/Molecules/AppointmentCard";

// Atoms
import CopyCalendarButton from "@/components/Atoms/CopyCalendarButton";

// Shadcn UI
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// --- Helper Types and Components ---
interface CalendarEvent {
  title: string;
  start: Date;
  end: Date;
  allDay: boolean;
  resource: ApiEvent;
}

interface CalendarToolbarProps {
  label: string;
  onNavigate: (action: string) => void;
  onView: (view: string) => void;
  views: string[];
  view: string;
}

function CalendarToolbar({ label, onNavigate, onView, views, view }: CalendarToolbarProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={() => onNavigate("PREV")}>{"<"}</Button>
        <span className="font-semibold text-lg mx-2">{label}</span>
        <Button variant="outline" size="sm" onClick={() => onNavigate("NEXT")}>{">"}</Button>
        <Button variant="ghost" size="sm" onClick={() => onNavigate("TODAY")}>Today</Button>
      </div>
      <div className="flex gap-2">
        {views.map((v: string) => (
          <Button
            key={v}
            variant={view === v ? "default" : "outline"}
            size="sm"
            onClick={() => onView(v)}
          >
            {v.charAt(0).toUpperCase() + v.slice(1).toLowerCase()}
          </Button>
        ))}
      </div>
    </div>
  );
}

const locales = { "en-US": enUS };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 0 }),
  getDay,
  locales,
});

const DnDCalendar = withDragAndDrop(Calendar);

export default function CalendarRoute() {
  const { data: eventsData, isLoading, error } = useGetAllEvents();

  // Local state for events to allow drag-and-drop updates
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  const updateEventMutation = useUpdateEvent();
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<ApiEvent | null>(null);
  const [formData, setFormData] = useState<
    CreateEventInput & { userId?: string }
  >({
    title: "",
    description: "",
    start: "",
    end: "",
    location: "",
    extendedProps: {
      type: "appointment",
      isPickup: false,
      address: "",
    },
  });

  // State for view modal
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewEvent, setViewEvent] = useState<ApiEvent | null>(null);

  // Set default view based on device type (only on mount)
  const [calendarView, setCalendarView] = useState(() =>
    typeof window !== "undefined" && window.matchMedia("(max-width: 768px)").matches
      ? Views.DAY
      : Views.WEEK
  );

  useEffect(() => {
    setEvents(
      Array.isArray(eventsData)
        ? eventsData.map((event: ApiEvent) => ({
            title: event.title,
            start: new Date(event.start),
            end: new Date(event.end),
            allDay: false,
            resource: event,
          }))
        : []
    );
  }, [eventsData]);

  // Drag and drop handlers
  const onEventDrop = async ({
    event,
    start,
    end,
    allDay,
  }: {
    event: CalendarEvent;
    start: Date;
    end: Date;
    allDay: boolean;
  }) => {
    const updatedEvent: ApiEvent = {
      ...event.resource,
      start: start.toISOString(),
      end: end.toISOString(),
    };
    setEvents((prev) =>
      prev.map((evt) =>
        evt === event
          ? { ...evt, start, end, allDay, resource: updatedEvent }
          : evt
      )
    );
    try {
      await updateEventMutation.mutateAsync(updatedEvent);
    } catch {
      alert("Failed to update event on server");
    }
  };

  const onEventResize = async ({
    event,
    start,
    end,
  }: {
    event: CalendarEvent;
    start: Date;
    end: Date;
  }) => {
    const updatedEvent: ApiEvent = {
      ...event.resource,
      start: start.toISOString(),
      end: end.toISOString(),
    };
    setEvents((prev) =>
      prev.map((evt) =>
        evt === event ? { ...evt, start, end, resource: updatedEvent } : evt
      )
    );
    try {
      await updateEventMutation.mutateAsync(updatedEvent);
    } catch {
      alert("Failed to update event on server");
    }
  };

  // Slot selection handler for new event creation
  const onSelectSlot = (slotInfo: {
    start: Date;
    end: Date;
    slots: Date[];
    action: string;
  }) => {
    setSelectedEvent(null);
    setFormData({
      title: "",
      description: "",
      start: slotInfo.start.toISOString().slice(0, 16),
      end: slotInfo.end.toISOString().slice(0, 16),
      location: "",
      extendedProps: {
        type: "appointment",
        isPickup: false,
        address: "",
      },
    });
    setIsModalOpen(true);
  };

  const eventPropGetter = (event: CalendarEvent) => {
    let backgroundColor = "#2563eb"; // default blue

    if (event.resource.extendedProps.type === "appointment") {
      backgroundColor = "#2563eb"; // blue for appointment
    } else if (event.resource.extendedProps.type === "availability") {
      backgroundColor = "#22c55e"; // green for availability
    }

    return {
      style: {
        backgroundColor,
        color: "white",
        borderRadius: "6px",
        border: "none",
        padding: "2px 8px",
      },
    };
  };

  const formats = {
    eventTimeRangeFormat: () => {
      return "";
    },
  };
  const safeEvents = events;

  if (isLoading || !Array.isArray(events)) return <div>Loading events...</div>;
  if (error) return <div>Failed to load events</div>;

  // Only render calendar if events is an array (should always be true, but extra safe)
  if (!Array.isArray(events)) return null;

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader className="flex flex-row items-bottom justify-between pb-2">
          <CardTitle className="text-2xl font-bold">Calendar</CardTitle>
          <CopyCalendarButton />
        </CardHeader>
        <CardContent>
          <DnDCalendar
            formats={formats}
            localizer={localizer}
            events={safeEvents}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 600 }}
            className="rounded-lg shadow bg-white"
            view={calendarView}
            onView={setCalendarView}
            min={new Date(new Date().setHours(7, 0, 0, 0))}
            max={new Date(new Date().setHours(22, 0, 0, 0))}
            onEventDrop={onEventDrop}
            onEventResize={onEventResize}
            resizable
            draggableAccessor={() => true}
            onSelectSlot={onSelectSlot}
            selectable
            step={15} // each slot is 15 minutes
            timeslots={2} // 1 slot per step => 15-minute intervals
            eventPropGetter={eventPropGetter}
            views={[Views.DAY, Views.AGENDA, Views.WEEK, Views.MONTH]}
            components={{
              toolbar: (props: CalendarToolbarProps) => (
                <CalendarToolbar {...props} />
              ),
              event: ({ event }: { event: CalendarEvent }) => (
                <EventCell
                  event={event}
                  setViewEvent={setViewEvent}
                  setIsViewModalOpen={setIsViewModalOpen}
                  setSelectedEvent={setSelectedEvent}
                  setFormData={setFormData}
                  setIsModalOpen={setIsModalOpen}
                />
              ),
              time: () => null,
            }}
          />
        </CardContent>
      </Card>
      <NewEventModal
        formData={formData}
        setFormData={setFormData}
        selectedEvent={selectedEvent}
        setModalOpen={setIsModalOpen}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogTitle>Appointment Details</DialogTitle>
          {viewEvent && (
            <AppointmentCard apt={viewEvent} handleStatusChange={() => {}} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
