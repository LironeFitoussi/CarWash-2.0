import { toIsraelTime } from "@/utils/calendarHelpers";
import { toast } from "sonner";
import { useGetAllEvents, useUpdateEvent } from "@/hooks/useEvent";
import { useTranslation } from "react-i18next";

import AddAppoitmentButton from "@/components/Atoms/AddAppoitmentButton";
import { type Event } from "@/api/events";
import { AppointmentSkeleton } from "@/components/Atoms/AppointmentSkeleton";
import { AppointmentsList } from "@/components/Organisms/AppointmentsList";
import { ScrollArea } from "@/components/ui/scroll-area";

type GroupedAppointments = {
  [date: string]: Event[];
};

export default function AppointmentsRoute() {
  const { t } = useTranslation();
  const { data: events, isLoading, error } = useGetAllEvents();
  const updateEventMutation = useUpdateEvent();

  // Group events by date
  const appointments: GroupedAppointments = {};
  if (events) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const appointmentsWithTimezone = events.map((event: any) => ({
      ...event,
      start: toIsraelTime(new Date(event.start)).toISOString(),
      end: toIsraelTime(new Date(event.end)).toISOString(),
      createdAt: event.createdAt || new Date().toISOString(),
      updatedAt: event.updatedAt || new Date().toISOString(),
      extendedProps: event.extendedProps || { type: '', isPickup: false },
    }));
    for (const apt of appointmentsWithTimezone) {
      const date = new Date(apt.start).toLocaleDateString("he-IL", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      if (!appointments[date]) appointments[date] = [];
      appointments[date].push(apt);
    }
  }

  const handleStatusChange = (
    appointmentId: string,
    newStatus: "pending" | "confirmed" | "cancelled" | "completed"
  ) => {
    // Find the appointment object
    const apt = Object.values(appointments).flat().find((a) => a._id === appointmentId);
    if (!apt) {
      toast.error("Appointment not found");
      return;
    }
    updateEventMutation.mutate(
      { ...apt, status: newStatus },
      {
        onSuccess: () => {
          toast.success(`Appointment ${newStatus} successfully`);
        },
        onError: () => {
          toast.error(`Failed to update appointment status to ${newStatus}`);
        },
      }
    );
  };

  if (error) {
    toast.error(t('admin.appointments.loadError', 'Failed to load appointments'));
  }

  return (
    <ScrollArea className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold mb-6">📅 {t('admin.appointments.title', 'Appointments')}</h1>
        <AddAppoitmentButton />
      </div>
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <AppointmentSkeleton key={i} />
          ))}
        </div>
      ) : (
        <AppointmentsList appointments={appointments} handleStatusChange={handleStatusChange} />
      )}
    </ScrollArea>
  );
}
