// src/components/ColorInput.tsx

import React from 'react';
import { SwatchesPicker } from 'react-color';
import Icons from '@/iconsSvg';

interface ColorInputProps {
  colors: string[];
  inputColor: string;
  onColorChange: (color: string) => void;
  onColorDelete: (index: number) => void;
  onInputChange: (value: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

const ColorInput: React.FC<ColorInputProps> = ({
  colors,
  inputColor,
  onColorChange,
  onColorDelete,
  onInputChange,
  onKeyDown,
}) => (
  <div className="py-5 ml-5">
    <SwatchesPicker color={colors[0] || '#d7ccc8'} onChangeComplete={(color) => onColorChange(color.hex)} />
    <div className="mt-2">
      <input
        className="input p-2 border border-gray-300 rounded"
        type="text"
        value={inputColor}
        onChange={(e) => onInputChange(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder="Enter color hex (e.g., #FF5733)"
      />
    </div>
    <div
      className="mt-2 flex flex-wrap gap-2"
      style={{ maxWidth: '500px', overflow: 'auto' }}
    >
      {colors.map((color, index) => (
        <div
          key={index}
          className="relative rounded-full"
          style={{
            width: '50px',
            height: '50px',
            margin: '5px',
            display: 'inline-block',
            backgroundColor: color,
          }}
        >
          <div
            className="absolute top-0 right-0 p-1 text-red-500 cursor-pointer"
            onClick={() => onColorDelete(index)}
            style={{ transform: 'translate(25%, -25%)' }}
          >
            {Icons.DeleteIcon}
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default ColorInput;
