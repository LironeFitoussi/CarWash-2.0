import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type EventTypeSelectorProps = {
  value: string;
  onValueChange: (value: string) => void;
};

const EventTypeSelector: React.FC<EventTypeSelectorProps> = ({ value, onValueChange }) => (
  <Select value={value} onValueChange={onValueChange}>
    <SelectTrigger>
      <SelectValue defaultValue={value} placeholder="Select type" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="appointment">Appointment</SelectItem>
      <SelectItem value="availability">Availability</SelectItem>
    </SelectContent>
  </Select>
);

export default EventTypeSelector; 