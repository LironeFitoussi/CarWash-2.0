import { useEffect, useState } from "react";
import { eventsApi } from "@/api/events";
import { toIsraelTime } from "@/utils/calendarHelpers";
import { toast } from "sonner";

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
  const [appointments, setAppointments] = useState<GroupedAppointments>({});
  const [loading, setLoading] = useState(true);

  const loadAppointments = async () => {
    try {
      const data: Event[] = await eventsApi.getAll();

      const appointmentsWithTimezone = data.map((event) => ({
        ...event,
        start: toIsraelTime(new Date(event.start)).toISOString(),
        end: toIsraelTime(new Date(event.end)).toISOString(),
      }));

      const grouped: GroupedAppointments = {};
      for (const apt of appointmentsWithTimezone) {
        const date = new Date(apt.start).toLocaleDateString("he-IL", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        });

        if (!grouped[date]) grouped[date] = [];
        grouped[date].push(apt);
      }

      setAppointments(grouped);
    } catch (error) {
      toast.error("Failed to load appointments");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (
    appointmentId: string,
    newStatus: "pending" | "confirmed" | "cancelled" | "completed"
  ) => {
    try {
      await eventsApi.update(appointmentId, { status: newStatus });
      toast.success(`Appointment ${newStatus} successfully`);
      await loadAppointments();
    } catch (error) {
      toast.error(`Failed to update appointment status to ${newStatus}`);
      console.error(error);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  return (
    <ScrollArea className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold mb-6">📅 Appointments</h1>
        <AddAppoitmentButton />
      </div>
      {loading ? (
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
