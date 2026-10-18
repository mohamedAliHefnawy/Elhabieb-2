// src/components/PropertyInput.tsx

import React from 'react';
import { Button } from '@nextui-org/react';
import Icons from '@/iconsSvg';

interface PropertyInputProps {
  properties: string[];
  onPropertyChange: (index: number, value: string) => void;
  onAddProperty: () => void;
  onDeleteProperty: (index: number) => void;
}

const PropertyInput: React.FC<PropertyInputProps> = ({
  properties,
  onPropertyChange,
  onAddProperty,
  onDeleteProperty,
}) => (
  <div className="flex flex-col mt-2">
    <Button className="mb-2 w-full" onClick={onAddProperty}>
      إضافة خاصية جديدة
    </Button>
    {properties.map((property, index) => (
      <div key={index} className="flex items-center mb-2">
        <input
          className="input w-full"
          type="text"
          value={property}
          onChange={(e) => onPropertyChange(index, e.target.value)}
          required
        />
        <p
          className="text-red-500 hover:cursor-pointer opacity-50 mr-1"
          onClick={() => onDeleteProperty(index)}
        >
          {Icons.DeleteIcon}
        </p>
      </div>
    ))}
  </div>
);

export default PropertyInput;
