import { FaCar, FaEye, FaPen } from "react-icons/fa";
import { fromUTCToLocal } from "@/utils/calendarHelpers";
import type { Event as ApiEvent } from "@/api/events";
import type { CreateEventInput } from "@/components/Organisms/NewEventModal";

// Type for events used in the calendar
interface CalendarEvent {
  title: string;
  start: Date;
  end: Date;
  allDay: boolean;
  resource: ApiEvent;
}

export default function EventCell({
  event,
  setViewEvent,
  setIsViewModalOpen,
  setSelectedEvent,
  setFormData,
  setIsModalOpen,
}: {
  event: CalendarEvent;
  setViewEvent: (event: ApiEvent) => void;
  setIsViewModalOpen: (isOpen: boolean) => void;
  setSelectedEvent: (event: ApiEvent) => void;
  setFormData: (formData: CreateEventInput & { userId?: string }) => void;
  setIsModalOpen: (isOpen: boolean) => void;
}) {
  return (
    <div
      className="flex flex-col justify-between rounded p-1 w-full"
      style={{ height: "calc(100% - .5rem)" }}
    >
      <div className="flex items-center w-full mb-1">
        <span className="font-semibold truncate flex-1 h-full whitespace-pre-line text-sm">
          {event.title}
        </span>
      </div>
      <div className="flex items-center justify-between w-full mt-auto">
        {event.resource.extendedProps.isPickup && (
          <FaCar className="inline-block text-white text-lg" />
        )}
        <div className="flex gap-2">
          <button
            className=" rounded text-base flex items-center gap-1 text-white"
            onClick={(e) => {
              e.stopPropagation();
              setViewEvent(event.resource);
              setIsViewModalOpen(true);
            }}
          >
            <FaEye className="inline-block text-white text-lg" />
            <span className="sr-only">View</span>
          </button>
          <button
            className=" rounded text-base flex items-center gap-1 text-white"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedEvent(event.resource);
              setFormData({
                title: event.resource.title,
                description: event.resource.description,
                start: fromUTCToLocal(event.resource.start),
                end: fromUTCToLocal(event.resource.end),
                location: event.resource.location || "",
                extendedProps: {
                  ...event.resource.extendedProps,
                },
              });
              setIsModalOpen(true);
            }}
          >
            <FaPen className="inline-block text-white text-lg" />
            <span className="sr-only">Edit</span>
          </button>
        </div>
      </div>
    </div>
  );
}
