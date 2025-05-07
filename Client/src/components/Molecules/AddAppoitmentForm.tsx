import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

// Types
import type { NewAppointment } from '@/types'

// Components
import UserSelect from "./UserSelect"
export default function AddAppointmentForm({ formData, setFormData }: { formData: NewAppointment, setFormData: (formData: NewAppointment) => void }) {
  const [title, setTitle] = useState(formData.title)
  const [description, setDescription] = useState(formData.description)
  const [date, setDate] = useState(formData.start)
  const [time, setTime] = useState(formData.end)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Simulate API call
    try {
      if (!title || !date || !time) {
        toast.error("Please fill in required fields")
        return
      }

      const newAppointment = {
        title,
        description,
        date,
        time,
      }

      console.log("Submitting:", newAppointment)
      toast.success("Appointment added!")
    } catch (error: unknown) {
      toast.error("Failed to add appointment")
      console.error("Failed to add appointment:", error)
    }
  }

  const handleUserSelect = (userId: string | null) => {
    if (userId) {
      setFormData({ ...formData, userId })
    }
  }

  const handleAddUserClick = (searchTerm: string) => {
    console.log("Adding user:", searchTerm)
  }


  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
      <UserSelect onUserSelect={handleUserSelect} onAddUserClick={handleAddUserClick} />
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Meeting with John"
          required
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Discussion about project progress"
        />
      </div>

      <div>
        <Label htmlFor="date">Date</Label>
        <Input
          id="date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>

      <div>
        <Label htmlFor="time">Time</Label>
        <Input
          id="time"
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          required
        />
      </div>

      <Button type="submit">Add Appointment</Button>
    </form>
  )
}
