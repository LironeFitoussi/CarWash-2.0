import { Button } from "../ui/button";
import { useState } from "react";
import NewEventModal from "../Organisms/NewEventModal";
import type { CreateEventInput } from "../Organisms/NewEventModal";

export default function AddAppoitmentButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<CreateEventInput>({
    title: "",
    description: "",
    start: "",
    end: "",
    location: "",
    extendedProps: {
      type: "appointment",
      isPickup: false,
      address: "",
    },
  });
  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Add Appointment</Button>
      {/* <AddAppoitmentModal isOpen={isOpen} onClose={() => setIsOpen(false)} /> */}
      <NewEventModal
        selectedEvent={null}
        setModalOpen={setIsOpen}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        formData={formData}
        setFormData={setFormData}
      />
    </>
  );
}
