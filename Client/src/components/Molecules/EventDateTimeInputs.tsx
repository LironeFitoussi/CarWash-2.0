import React from 'react';
import { Input } from '@/components/ui/input';
import type { ChangeEvent } from 'react';

type EventDateTimeInputsProps = {
  start: string;
  end: string;
  onStartChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onEndChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

const EventDateTimeInputs: React.FC<EventDateTimeInputsProps> = ({ start, end, onStartChange, onEndChange }) => (
  <>
    <Input
      type="datetime-local"
      value={start}
      onChange={onStartChange}
    />
    <Input
      type="datetime-local"
      value={end}
      onChange={onEndChange}
    />
  </>
);

export default EventDateTimeInputs; 