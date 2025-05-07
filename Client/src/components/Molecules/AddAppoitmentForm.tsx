import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

// Types
import type { NewAppointment } from '@/types'

// Hooks
import { useCreateEvent } from "@/hooks/useEvent"

// Components
import UserSelect from "./UserSelect"
import { useEffect } from "react"
export default function AddAppointmentForm({ onClose, formData, setFormData }: { onClose: () => void, formData: NewAppointment, setFormData: (formData: NewAppointment) => void }) {
    const { mutate: createEvent, isPending, error } = useCreateEvent({
        onSuccess: () => {
            // Clean form data
            setFormData({
                title: "",
                start: "",
                end: "",
                description: "",
                location: "",
                extendedProps: {
                    type: "appointment",
                    userId: "",
                    isPickup: false,
                    address: "",
                }
            })
          toast.success("Appointment added!");
          onClose();
        }
      });
    
      const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createEvent({
          ...formData,
          extendedProps: {
            ...formData.extendedProps,
            isPickup: formData.extendedProps.isPickup ?? false,
          },
        });
      };
    
      useEffect(() => {
        if (isPending) toast.loading("Adding appointment...");
        if (error) toast.error("Failed to add appointment");
      }, [isPending, error]);

  const handleUserSelect = (userId: string | null, userFullName: string) => {
    if (userId) {
      setFormData({ ...formData, extendedProps: { ...formData.extendedProps, userId }, title: `Car Wash Appointment - ${userFullName}` })
    }
  }

  const handleAddUserClick = (searchTerm: string) => {
    console.log("Adding user:", searchTerm)
  }

  console.log(formData)

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
      <UserSelect onUserSelect={handleUserSelect} onAddUserClick={handleAddUserClick} />

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Discussion about project progress"
        />
      </div>

      {/* Start Date and Time */}
      <div>
        <Label htmlFor="start">Start</Label>
        <Input
          id="start"
          type="datetime-local"
          value={formData.start}
          onChange={(e) => setFormData({ ...formData, start: e.target.value })}
          required
        />
      </div>

      {/* End Date and Time */}
      <div>
        <Label htmlFor="end">End</Label>
        <Input
          id="end"
          type="datetime-local"
          value={formData.end}
          onChange={(e) => setFormData({ ...formData, end: e.target.value })}
          required
        />
      </div>

      <Button type="submit">Add Appointment</Button>
    </form>
  )
}
