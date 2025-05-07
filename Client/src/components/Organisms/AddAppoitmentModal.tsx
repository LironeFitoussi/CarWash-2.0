import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useState } from "react";

// Components
import AddAppoitmentForm from "../Molecules/AddAppoitmentForm";

export default function AddAppoitmentModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
    const [ formData, setFormData ] = useState({
        userId: "",
        title: "",
        start: "",
        end: "",
        location: "",
        description: "",
    })
    
    
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Appointment</DialogTitle>
                </DialogHeader>
                <DialogDescription>
                    <p>Add an appointment to the calendar</p>
                </DialogDescription>
                <AddAppoitmentForm formData={formData} setFormData={setFormData} />
            </DialogContent>
        </Dialog>
    )
}
