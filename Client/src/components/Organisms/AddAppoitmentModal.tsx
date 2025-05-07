import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useState } from "react";

// Components
import AddAppoitmentForm from "../Molecules/AddAppoitmentForm";

// Types
import type { NewAppointment } from "@/types";

export default function AddAppoitmentModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
    const [ formData, setFormData ] = useState<NewAppointment>({
        title: "",
        start: "",
        end: "",
        location: "",
        description: "",
        extendedProps: {
            type: "appointment",
            isPickup: undefined,
            userId: "",
        }
    })
    
    
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Appointment</DialogTitle>
                </DialogHeader>
                <DialogDescription>
                    Add an appointment to the calendar
                </DialogDescription>
                <AddAppoitmentForm onClose={onClose} formData={formData} setFormData={setFormData} />
            </DialogContent>
        </Dialog>
    )
}
