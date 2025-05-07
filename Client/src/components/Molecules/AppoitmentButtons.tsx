import { type Event } from "@/api/events";
import IconButton from "@/components/Atoms/IconButton";
import { TooltipProvider } from "@/components/ui/tooltip";

type StatusType = 'pending' | 'confirmed' | 'cancelled' | 'completed';

export const AppointmentButtons = ({ apt, handleStatusChange }: { apt: Event, handleStatusChange: (id: string, status: StatusType) => Promise<void> | void }) => {
  const buttons = [];

  // Always show roll back to pending button except for pending status
  if (apt.status !== 'pending') {
    buttons.push(
      <IconButton
        key="pending"
        onClick={() => handleStatusChange(apt._id, 'pending')}
        icon="⟲"
        label="Roll back to Pending"
        color="text-yellow-600 hover:text-yellow-700"
        className="cursor-pointer"
      />
    );
  }

  switch (apt.status) {
    case 'pending':
      buttons.push(
        <IconButton
          key="confirm"
          onClick={() => handleStatusChange(apt._id, 'confirmed')}
          icon="✓"
          label="Confirm Appointment"
          color="text-green-600 hover:text-green-700"
          className="cursor-pointer"
        />
      );
      break;
    case 'confirmed':
      buttons.push(
        <IconButton
          key="complete"
          onClick={() => handleStatusChange(apt._id, 'completed')}
          icon="★"
          label="Mark as Completed"
          color="text-blue-600 hover:text-blue-700"
          className="cursor-pointer"
        />,
        <IconButton
          key="cancel"
          onClick={() => handleStatusChange(apt._id, 'cancelled')}
          icon="×"
          label="Cancel Appointment"
          color="text-red-600 hover:text-red-700"
          className="cursor-pointer"
        />
      );
      break;
    case 'completed':
      buttons.push(
        <IconButton
          key="reopen"
          onClick={() => handleStatusChange(apt._id, 'confirmed')}
          icon="↻"
          label="Reopen as Confirmed"
          color="text-green-600 hover:text-green-700"
          className="cursor-pointer"
        />
      );
      break;
  }

  return (
    <TooltipProvider>
      <div className="flex gap-1">
        {buttons}
      </div>
    </TooltipProvider>
  );
};