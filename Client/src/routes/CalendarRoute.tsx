import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import type { DateSelectArg, EventClickArg } from "@fullcalendar/core";
import type {
  EventResizeStopArg,
  EventDragStopArg,
} from "@fullcalendar/interaction";
import { toast } from "sonner";
import { eventsApi } from "@/api/events";
import type { Event as ApiEvent, CreateEventInput } from "@/api/events";
import { useMediaQuery } from "@/hooks/useMediaQuery";

// Helpers
import { toIsraelTime, fromUTCToLocal } from "@/utils/calendarHelpers";

// Components
import NewEventModal from "@/components/Organisms/NewEventModal";
import CopyCalendarButton from "@/components/Atoms/CopyCalendarButton";

export default function CalendarRoute() {
  const [events, setEvents] = useState<ApiEvent[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<ApiEvent | null>(null);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [formData, setFormData] = useState<CreateEventInput>({
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

  // console.log(formData);
  
  const loadEvents = async () => {
    try {
      const data = await eventsApi.getAll();
      // console.log(data);
      
      const eventsWithTimezone = data.map((event) => ({
        ...event,
        start: toIsraelTime(new Date(event.start)).toISOString(),
        end: toIsraelTime(new Date(event.end)).toISOString(),
      }));
      // console.log(eventsWithTimezone);
      
      setEvents(eventsWithTimezone);
    } catch (error) {
      toast.error("Failed to load events");
      console.error("Failed to load events:", error);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    setFormData({
      title: "",
      description: "",
      start: selectInfo.startStr,
      end: selectInfo.endStr,
      location: "",
      extendedProps: {
        type: "appointment",
        isPickup: false,
        address: "",
      },
    });
    setSelectedEvent(null);
    setIsModalOpen(true);
  };

  // console.log(formData);
  
  const handleEventClick = (clickInfo: EventClickArg) => {
    const event = events.find((e) => e._id === clickInfo.event.id);
    if (event) {
      setSelectedEvent(event);
      setFormData({
        title: event.title,
        description: event.description,
        start: fromUTCToLocal(event.start),
        end: fromUTCToLocal(event.end),
        location: event.location || "",
        extendedProps: {
          type: event.extendedProps.type,
          isPickup: event.extendedProps.isPickup,
          address: event.extendedProps.address || "",
        },
      });
      setIsModalOpen(true);
    }
  };

  const handleEventDrop = async (dropInfo: EventDragStopArg) => {
    const event = events.find((e) => e._id === dropInfo.event.id);
    if (!event) return;

    try {
      await eventsApi.update(event._id, {
        start: dropInfo.event.startStr,
        end: dropInfo.event.endStr,
      });
      await loadEvents();
    } catch (error) {
      toast.error("Failed to update event");
      console.error("Failed to update event:", error);
      dropInfo.event.setDates(event.start, event.end);
    }
  };

  const handleEventResize = async (resizeInfo: EventResizeStopArg) => {
    const event = events.find((e) => e._id === resizeInfo.event.id);
    if (!event) return;

    try {
      await eventsApi.update(event._id, {
        start: resizeInfo.event.startStr,
        end: resizeInfo.event.endStr,
      });
      await loadEvents();
    } catch (error) {
      toast.error("Failed to update event");
      console.error("Failed to update event:", error);
      resizeInfo.event.setDates(event.start, event.end);
    }
  };

  return (
    <>
      <div className="container mx-auto p-4">
        <CopyCalendarButton />

        <div className="bg-white rounded-lg shadow p-4">
          <FullCalendar
            plugins={[timeGridPlugin, interactionPlugin]}
            initialView={isMobile ? "timeGridDay" : "timeGridWeek"}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: isMobile ? "" : "timeGridWeek",
            }}
            timeZone="Asia/Jerusalem"
            editable={true}
            selectable={true}
            selectMirror={true}
            slotMinTime="06:00:00"
            slotMaxTime="22:00:00"
            allDaySlot={false}
            snapDuration="00:15:00"
            dayCellDidMount={(arg) => {
              const twoWeeksFromNow = new Date();
              twoWeeksFromNow.setDate(twoWeeksFromNow.getDate() + 14);
              if (arg.date >= twoWeeksFromNow) {
                arg.el.classList.add('fc-day-disabled') // custom class
              }
            }}
            selectAllow={(selectInfo) => {
              const twoWeeksFromNow = new Date();
              twoWeeksFromNow.setDate(twoWeeksFromNow.getDate() + 14);
              return selectInfo.start < twoWeeksFromNow;
            }}
            events={events.map((event) => ({
              id: event._id,
              title: event.title,
              start: event.start,
              end: event.end,
              description: event.description,
              extendedProps: {
                type: event.extendedProps.type,
                isPickup: event.extendedProps.isPickup,
                address: event.extendedProps.address,
              },
            }))}
            select={handleDateSelect}
            eventClick={handleEventClick}
            eventResize={handleEventResize}
            eventDrop={handleEventDrop}
            height="auto"
            slotEventOverlap={false}
            eventOverlap={false}
            forceEventDuration={true}
            eventContent={(arg) => {
              return (
                <>
                  <div className="font-semibold">{arg.event.title}</div>
                  {arg.event.extendedProps.address && (
                    <div className="text-sm text-gray-600">📍 {arg.event.extendedProps.address}</div>
                  )}
                </>
              )
            }}
          />
        </div>
      </div>

      <NewEventModal
        formData={formData}
        setFormData={setFormData}
        selectedEvent={selectedEvent}
        loadEvents={loadEvents}
        setModalOpen={setIsModalOpen}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}