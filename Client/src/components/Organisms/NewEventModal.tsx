import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Button } from "@/components/ui/button";
// import type { ChangeEvent } from "react";
import { toast } from "sonner";
import { toUTCForAPI } from "@/utils/calendarHelpers";
// import { Checkbox } from "@/components/ui/checkbox";
import type {
  CreateEventInput as OrigCreateEventInput,
  Event as ApiEvent,
} from "@/api/events";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Label } from "@radix-ui/react-label";

// Components
import GoogleAddressLookup from "@/components/Molecules/GoogleAddressLookup";
import {
  useCreateEvent,
  useUpdateEvent,
  useDeleteEvent,
} from "@/hooks/useEvent";
import UserSelect from "@/components/Molecules/UserSelect";
import EventTitleInput from "@/components/Molecules/EventTitleInput";
import EventDescriptionInput from "@/components/Molecules/EventDescriptionInput";
import EventDateTimeInputs from "@/components/Molecules/EventDateTimeInputs";
import EventTypeSelector from "@/components/Molecules/EventTypeSelector";
import PickupCheckbox from "@/components/Molecules/PickupCheckbox";
import EventModalFooter from "@/components/Molecules/EventModalFooter";

// Extend CreateEventInput to allow userId in extendedProps
export type CreateEventInput = Omit<OrigCreateEventInput, "extendedProps"> & {
  extendedProps: OrigCreateEventInput["extendedProps"] & { userId?: string };
};

export default function NewEventModal({
  selectedEvent,
  setModalOpen,
  isOpen,
  onClose,
  formData,
  setFormData,
}: {
  selectedEvent: ApiEvent | null;
  setModalOpen: (open: boolean) => void;
  isOpen: boolean;
  onClose: () => void;
  formData: CreateEventInput & { userId?: string };
  setFormData: (formData: CreateEventInput & { userId?: string }) => void;
}) {
  const createEventMutation = useCreateEvent({
    onSuccess: () => setModalOpen(false),
  });
  const updateEventMutation = useUpdateEvent({
    onSuccess: () => setModalOpen(false),
  });
  const deleteEventMutation = useDeleteEvent({
    onSuccess: () => setModalOpen(false),
  });

  const handleSubmit = async () => {
    try {
      const apiFormData = {
        ...formData,
        start: toUTCForAPI(formData.start),
        end: toUTCForAPI(formData.end),
      };

      if (selectedEvent) {
        await updateEventMutation.mutateAsync({
          ...selectedEvent,
          ...apiFormData,
        });
        toast.success("Event updated successfully");
      } else {
        await createEventMutation.mutateAsync(apiFormData);
        toast.success("Event created successfully");
      }
    } catch (error) {
      toast.error("Failed to save event");
      console.error("Failed to save event:", error);
    }
  };
  const handleDelete = async () => {
    if (!selectedEvent) return;
    try {
      await deleteEventMutation.mutateAsync(selectedEvent._id);
      toast.success("Event deleted successfully");
    } catch (error) {
      toast.error("Failed to delete event");
      console.error("Failed to delete event:", error);
    }
  };

  const handleOpenChange = () => {
    // Check if the click target is part of the Google Places autocomplete
    const activeElement = document.activeElement;
    const pacContainer = document.querySelector(".pac-container");
    if (
      activeElement?.closest(".google-address-lookup") ||
      (pacContainer && pacContainer.contains(activeElement))
    ) {
      return;
    }
    onClose();
  };

  // User selection logic for appointments
  const handleUserSelect = (userId: string | null, userFullName: string) => {
    if (userId) {
      setFormData({
        ...formData,
        title: `Car Wash - ${userFullName}`,
        extendedProps: {
          ...formData.extendedProps,
          userId,
        },
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent
        onPointerDownCapture={(e) => {
          // Prevent closing when clicking inside the modal
          if (
            e.target instanceof Element &&
            (e.target.closest(".pac-container") ||
              e.target.closest(".google-address-lookup"))
          ) {
            e.stopPropagation();
          }
        }}
        onClick={(e) => {
          // Prevent closing when clicking inside the modal
          if (
            e.target instanceof Element &&
            (e.target.closest(".pac-container") ||
              e.target.closest(".google-address-lookup"))
          ) {
            e.stopPropagation();
          }
        }}
      >
        <DialogHeader>
          <DialogTitle>
            {selectedEvent ? "Edit Event" : "New Event"}
          </DialogTitle>
          <DialogDescription>Fill in the event details below</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {/* User select for appointments */}
          {formData.extendedProps.type === "appointment" && (
            <UserSelect onUserSelect={handleUserSelect} />
          )}
          {/* Hide title input for appointments, show otherwise */}
          {formData.extendedProps.type !== "appointment" && (
            <EventTitleInput
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          )}
          <EventDescriptionInput
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
          <EventDateTimeInputs
            start={formData.start}
            end={formData.end}
            onStartChange={(e) => setFormData({ ...formData, start: e.target.value })}
            onEndChange={(e) => setFormData({ ...formData, end: e.target.value })}
          />
          <EventTypeSelector
            value={formData.extendedProps.type}
            onValueChange={(value) => {
              if (value === "availability") {
                setFormData({
                  ...formData,
                  extendedProps: {
                    type: value,
                    isPickup: false,
                  },
                });
              } else {
                setFormData({
                  ...formData,
                  extendedProps: {
                    ...formData.extendedProps,
                    type: value,
                  },
                });
              }
            }}
          />
          {/* Pickup checkbox */}
          {formData.extendedProps.type === "appointment" && (
            <PickupCheckbox
              checked={formData.extendedProps.isPickup}
              onCheckedChange={(value) =>
                setFormData({
                  ...formData,
                  extendedProps: {
                    ...formData.extendedProps,
                    type: formData.extendedProps.type,
                    isPickup: value,
                  },
                })
              }
            />
          )}
          {/* In Case of pickup, open address input */}
          {formData.extendedProps.isPickup && (
            <div
              onMouseDown={(e) => e.stopPropagation()}
              onClick={(e) => e.stopPropagation()}
            >
              <GoogleAddressLookup
                placeholder="Pickup Address"
                value={formData.extendedProps.address}
                onAddressSelect={(address) =>
                  setFormData({
                    ...formData,
                    extendedProps: {
                      ...formData.extendedProps,
                      address: address.formatted_address,
                    },
                  })
                }
              />
            </div>
          )}
        </div>
        <DialogFooter className="flex justify-between">
          <EventModalFooter
            selectedEvent={!!selectedEvent}
            onDelete={handleDelete}
            onCancel={() => setModalOpen(false)}
            onSubmit={handleSubmit}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
