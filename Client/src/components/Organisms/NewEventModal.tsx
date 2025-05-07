import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import type { ChangeEvent } from "react";
import { toast } from "sonner";
import { toUTCForAPI } from "@/utils/calendarHelpers";
import { Checkbox } from "@/components/ui/checkbox";
import type { CreateEventInput, Event as ApiEvent } from "@/api/events";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@radix-ui/react-label";

// Components
import GoogleAddressLookup from "@/components/Molecules/GoogleAddressLookup";
import { useCreateEvent, useUpdateEvent, useDeleteEvent } from '@/hooks/useEvent';

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
  formData: CreateEventInput;
  setFormData: (formData: CreateEventInput) => void;
}) {
  const createEventMutation = useCreateEvent({ onSuccess: () => setModalOpen(false) });
  const updateEventMutation = useUpdateEvent({ onSuccess: () => setModalOpen(false) });
  const deleteEventMutation = useDeleteEvent({ onSuccess: () => setModalOpen(false) });

  const handleSubmit = async () => {
    try {
      const apiFormData = {
        ...formData,
        start: toUTCForAPI(formData.start),
        end: toUTCForAPI(formData.end),
      };

      if (selectedEvent) {
        await updateEventMutation.mutateAsync({ ...selectedEvent, ...apiFormData });
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
    const pacContainer = document.querySelector('.pac-container');
    if (
      activeElement?.closest('.google-address-lookup') ||
      (pacContainer && pacContainer.contains(activeElement))
    ) {
      return;
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent onPointerDownCapture={(e) => {
        // Prevent closing when clicking inside the modal
        if (e.target instanceof Element && 
            (e.target.closest('.pac-container') || 
             e.target.closest('.google-address-lookup'))) {
          e.stopPropagation();
        }
      }}
      onClick={(e) => {
        // Prevent closing when clicking inside the modal
        if (e.target instanceof Element && 
            (e.target.closest('.pac-container') || 
             e.target.closest('.google-address-lookup'))) {
          e.stopPropagation();
        }
      }}>
        <DialogHeader>
          <DialogTitle>
            {selectedEvent ? "Edit Event" : "New Event"}
          </DialogTitle>
          <DialogDescription>Fill in the event details below</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Input
            placeholder="Event title"
            value={formData.title}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />
          <Textarea
            placeholder="Event description"
            value={formData.description}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
          <Input
            type="datetime-local"
            value={formData.start}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setFormData({ ...formData, start: e.target.value })
            }
          />
          <Input
            type="datetime-local"
            value={formData.end}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setFormData({ ...formData, end: e.target.value })
            }
          />
          <Select
            value={formData.extendedProps.type}
            onValueChange={(value) =>
              setFormData({
                ...formData,
                extendedProps: {
                  ...formData.extendedProps,
                  type: value,
                  isPickup: formData.extendedProps.isPickup,
                },
              })
            }
          >
            <SelectTrigger>
              <SelectValue defaultValue={formData.extendedProps.type} placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="appointment">Appointment</SelectItem>
              <SelectItem value="availability">Availability</SelectItem>
            </SelectContent>
          </Select>
          {/* Pickup checkbox */}
          <div className="flex items-center gap-2">
            <Checkbox
              checked={formData.extendedProps.isPickup}
              onCheckedChange={(value) =>
                setFormData({
                  ...formData,
                  extendedProps: {
                    ...formData.extendedProps,
                    type: formData.extendedProps.type,
                    isPickup: value as boolean,
                  },
                })
              }
            />
            <Label>Pickup</Label>
          </div>

          {/* In Case of pickup, open address input */}
          {formData.extendedProps.isPickup && (
            <div onMouseDown={(e) => e.stopPropagation()} onClick={(e) => e.stopPropagation()}>
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
          {selectedEvent && (
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          )}
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              {selectedEvent ? "Update" : "Create"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
