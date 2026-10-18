import Icons from "@/iconsSvg";
import { useState, useEffect } from "react";
import { ColorResult, SwatchesPicker } from "react-color";
import ModelDeleteColor from "../DeleteColor";

interface ColorsProps {
  productData: string[];
  onChange: (updatedColors: string[]) => void;
  productId: string;
  slug: string;
}

export default function Colors({
  productData,
  onChange,
  productId,
  slug,
}: ColorsProps) {
  const [colors, setColors] = useState<string[]>(productData || []); // Ensure it's an array
  const [inputColor, setInputColor] = useState<string>("");

  useEffect(() => {
    // تحديث الألوان فقط إذا تغيرت بيانات المنتج
    if (productData) {
      setColors(productData);
    }
  }, [productData]);
  

  const playErrorSound = () => {
    const audio = new Audio("/mp3/errorHex.mp3");
    audio.play();
  };

  const handleColorChange = (color: ColorResult) => {
    const newColors = [...colors, color.hex];
    setColors(newColors);
    onChange(newColors);
  };

  const handleColorDelete = (index: number) => {
    const newColors = colors.filter((_, i) => i !== index);
    setColors(newColors);
    onChange(newColors);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputColor(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const isValidColor = /^#([0-9A-F]{3}){1,2}$/i.test(inputColor);
      if (isValidColor) {
        const newColors = [...colors, inputColor];
        setColors(newColors);
        setInputColor("");
        onChange(newColors);
      } else {
        playErrorSound();
        setInputColor("");
      }
    }
  };

  return (
    <div className="py-5 ml-5">
      <SwatchesPicker
        color={colors.length > 0 ? colors[0] : "#d7ccc8"}
        onChangeComplete={handleColorChange}
        height={120}
      />
      <div className="mt-2">
        <input
          className="input p-2 border border-gray-300 rounded"
          type="text"
          value={inputColor}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Enter color hex (e.g., #FF5733)"
        />
      </div>
      <div
        className="mt-2 flex flex-wrap gap-2"
        style={{ maxWidth: "500px", overflow: "auto" }}
      >
        {colors.map((color, index) => (
          <div
            key={index}
            className="relative rounded-full"
            style={{
              width: "50px",
              height: "50px",
              margin: "5px",
              display: "inline-block",
              backgroundColor: color,
            }}
          >
            <ModelDeleteColor
              index={index} // Pass the correct index
              localProperties={colors} // Pass the current colors
              property={color} // Pass the current color
              productId={productId}
              onDelete={handleColorDelete} // Pass the handleColorDelete function
              slug={slug}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
