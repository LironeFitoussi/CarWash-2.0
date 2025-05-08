import React from 'react';
import { Input } from '@/components/ui/input';
import type { ChangeEvent } from 'react';

type EventTitleInputProps = {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

const EventTitleInput: React.FC<EventTitleInputProps> = ({ value, onChange }) => (
  <Input
    placeholder="Event title"
    value={value}
    onChange={onChange}
  />
);

export default EventTitleInput; 