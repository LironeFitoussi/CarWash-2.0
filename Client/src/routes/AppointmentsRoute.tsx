// import { useEffect, useState } from "react";
// import { eventsApi } from "@/api/events";
import { toIsraelTime } from "@/utils/calendarHelpers";
import { toast } from "sonner";
import { useGetAllEvents, useUpdateEvent } from "@/hooks/useEvent";

// UI components
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import AddAppoitmentButton from "@/components/Atoms/AddAppoitmentButton";
import { type Event } from "@/api/events";
import { AppointmentButtons } from "@/components/Molecules/AppoitmentButtons";

type GroupedAppointments = {
  [date: string]: Event[];
};

export default function AppointmentsRoute() {
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
    toast.error("Failed to load appointments");
  }

  return (
    <ScrollArea className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold mb-6">📅 Appointments</h1>
        <AddAppoitmentButton />
      </div>
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))}
        </div>
      ) : (
        Object.entries(appointments).map(([date, apts]) => (
          <div key={date}>
            <h2 className="text-xl font-semibold mb-3">{date}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {apts.map((apt) => (
                <Card
                  key={apt._id}
                  className="hover:shadow-lg transition-shadow duration-200"
                >
                  <CardHeader>
                    <CardTitle className="text-lg">{apt.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm space-y-2">
                    <div>
                      <strong>🕒</strong>{" "}
                      {new Date(apt.start).toLocaleTimeString("he-IL", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}{" "}
                      -{" "}
                      {new Date(apt.end).toLocaleTimeString("he-IL", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1">
                        <strong>📍</strong>{" "}
                        {apt.extendedProps?.address || apt.location || "N/A"}
                      </div>
                      {(apt.extendedProps?.address || apt.location) && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 p-0"
                                onClick={() => {
                                  const address = encodeURIComponent(
                                    apt.extendedProps?.address ||
                                      apt.location ||
                                      ""
                                  );
                                  window.open(
                                    `https://waze.com/ul?q=${address}&navigate=yes`,
                                    "_blank"
                                  );
                                }}
                              >
                                <img
                                  className="w-5 h-5 object-contain rounded cursor-pointer"
                                  src="/images/waze.png"
                                  alt="Open in Waze"
                                />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Open in Waze</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                    <div>
                      <strong>📝</strong> {apt.description}
                    </div>
                    <div className="flex items-center justify-between">
                      <Badge
                        variant="outline"
                        className={`capitalize ${
                          apt.status === "confirmed"
                            ? "text-green-600"
                            : apt.status === "cancelled"
                            ? "text-red-600"
                            : apt.status === "completed"
                            ? "text-blue-600"
                            : "text-yellow-600"
                        }`}
                      >
                        {apt.status}
                      </Badge>
                      <AppointmentButtons
                        apt={apt}
                        handleStatusChange={handleStatusChange}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))
      )}
    </ScrollArea>
  );
}
