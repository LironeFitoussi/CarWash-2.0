import { Button } from "../ui/button";
import AddAppoitmentModal from "../Organisms/AddAppoitmentModal";
import { useState } from "react";

export default function AddAppoitmentButton() {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <>
            <Button onClick={() => setIsOpen(true)}>
                Add Appointment
            </Button>
            <AddAppoitmentModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
        </>
    )
}

