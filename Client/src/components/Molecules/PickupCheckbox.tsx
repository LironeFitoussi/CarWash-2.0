import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@radix-ui/react-label';

type PickupCheckboxProps = {
  checked: boolean;
  onCheckedChange: (value: boolean) => void;
};

const PickupCheckbox: React.FC<PickupCheckboxProps> = ({ checked, onCheckedChange }) => (
  <div className="flex items-center gap-2">
    <Checkbox
      checked={checked}
      onCheckedChange={(value) => onCheckedChange(value as boolean)}
    />
    <Label>Pickup</Label>
  </div>
);

export default PickupCheckbox; 