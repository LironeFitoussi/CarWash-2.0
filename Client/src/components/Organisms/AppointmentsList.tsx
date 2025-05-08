import React from "react";
import { AppointmentCard } from "@/components/Molecules/AppointmentCard";
import { type Event } from "@/api/events";

export type GroupedAppointments = {
  [date: string]: Event[];
};

interface AppointmentsListProps {
  appointments: GroupedAppointments;
  handleStatusChange: (
    appointmentId: string,
    newStatus: "pending" | "confirmed" | "cancelled" | "completed"
  ) => void;
}

export const AppointmentsList: React.FC<AppointmentsListProps> = ({ appointments, handleStatusChange }) => (
  <>
    {Object.entries(appointments).map(([date, apts]) => (
      <div key={date}>
        <h2 className="text-xl font-semibold mb-3">{date}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {apts.map((apt) => (
            <AppointmentCard key={apt._id} apt={apt} handleStatusChange={handleStatusChange} />
          ))}
        </div>
      </div>
    ))}
  </>
); 