import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import type { ChangeEvent } from 'react';

type EventDescriptionInputProps = {
  value: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
};

const EventDescriptionInput: React.FC<EventDescriptionInputProps> = ({ value, onChange }) => (
  <Textarea
    placeholder="Event description"
    value={value}
    onChange={onChange}
  />
);

export default EventDescriptionInput; 