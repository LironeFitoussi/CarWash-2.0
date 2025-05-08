import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/Atoms/StatusBadge";
import { WazeButton } from "@/components/Atoms/WazeButton";
import { AppointmentButtons } from "@/components/Molecules/AppoitmentButtons";
import { type Event } from "@/api/events";

interface AppointmentCardProps {
  apt: Event;
  handleStatusChange: (
    appointmentId: string,
    newStatus: "pending" | "confirmed" | "cancelled" | "completed"
  ) => void;
}

export const AppointmentCard: React.FC<AppointmentCardProps> = ({ apt, handleStatusChange }) => {
  const allowedStatuses = ["pending", "confirmed", "cancelled", "completed"] as const;
  type StatusType = typeof allowedStatuses[number];
  const status: StatusType = allowedStatuses.includes(apt.status as StatusType)
    ? (apt.status as StatusType)
    : "pending";
  return (
    <Card key={apt._id} className="hover:shadow-lg transition-shadow duration-200">
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
          <WazeButton address={apt.extendedProps?.address || apt.location || ""} />
        </div>
        <div>
          <strong>📝</strong> {apt.description}
        </div>
        <div className="flex items-center justify-between">
          <StatusBadge status={status} />
          <AppointmentButtons apt={apt} handleStatusChange={handleStatusChange} />
        </div>
      </CardContent>
    </Card>
  );
}; 