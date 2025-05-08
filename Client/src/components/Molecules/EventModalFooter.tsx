import React from 'react';
import { Button } from '@/components/ui/button';

type EventModalFooterProps = {
  selectedEvent: boolean;
  onDelete: () => void;
  onCancel: () => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
};

const EventModalFooter: React.FC<EventModalFooterProps> = ({ selectedEvent, onDelete, onCancel, onSubmit, isSubmitting }) => (
  <div className="flex justify-between w-full">
    {selectedEvent && (
      <Button variant="destructive" onClick={onDelete} disabled={isSubmitting}>
        Delete
      </Button>
    )}
    <div className="flex gap-2">
      <Button variant="outline" onClick={onCancel} disabled={isSubmitting}>
        Cancel
      </Button>
      <Button onClick={onSubmit} disabled={isSubmitting}>
        {selectedEvent ? 'Update' : 'Create'}
      </Button>
    </div>
  </div>
);

export default EventModalFooter; 