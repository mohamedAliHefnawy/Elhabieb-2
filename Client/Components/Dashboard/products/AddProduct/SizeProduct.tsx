import Icons from "@/iconsSvg";
import { Button } from "@nextui-org/react";
import { useState, useEffect } from "react";
import ModelDeleteSize from "../DeleteSize";

interface SizeProps {
  properties: string[];
  onChange: (updatedProperties: string[]) => void;
  productId: string; // معرف المنتج
  slug: string;
}

export default function Size({
  properties,
  onChange,
  productId,
  slug,
}: SizeProps) {
  const [localProperties, setLocalProperties] = useState<string[]>(properties);

  useEffect(() => {
    if (JSON.stringify(localProperties) !== JSON.stringify(properties)) {
      setLocalProperties(properties);
    }
  }, [properties]);

  const playSuccessSound = () => {
    const audio = new Audio("/mp3/noRepeatName.mp3");
    audio.play();
  };

  const addProperty = () => {
    const newProperties = [...localProperties, ""];
    setLocalProperties(newProperties);
    onChange(newProperties);
  };

  const deleteProperty = (index: number, productId: string) => {
    const newProperties = localProperties.filter((_, i) => i !== index);
    setLocalProperties(newProperties);
    onChange(newProperties);
    console.log(`تم حذف الخاصية للمقاس ${index} للمنتج ${productId}`);
  };

  const handlePropertyChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = e.target;
    if (localProperties.includes(value) && value.trim() !== "") {
      playSuccessSound();
      const newProperties = [...localProperties];
      newProperties[index] = "";
      setLocalProperties(newProperties);
      onChange(newProperties);
      return;
    }

    const newProperties = [...localProperties];
    newProperties[index] = value;
    setLocalProperties(newProperties);
    onChange(newProperties);
  };

  return (
    <div className="px-4 py-5 border-1 border-r-0 border-y-0 border-dashed border-slate-400 flex self-stretch">
      <div className="flex flex-col mt-2">
        <div className="flex items-center w-[100%]">
          <Button className="mb-2 w-[100%]" onClick={addProperty}>
            إضافة خاصية جديدة
          </Button>
        </div>

        {localProperties?.map((property, index) => (
          <div key={index} className="flex items-center mb-2">
            <input
              className="input w-full"
              type="text"
              placeholder=""
              value={property}
              onChange={(e) => handlePropertyChange(index, e)}
              required
            />

            <ModelDeleteSize
              index={index}
              localProperties={localProperties}
              property={property} // تمرير الخاصية للمودال
              productId={productId} // تمرير معرف المنتج للمودال
              onDelete={deleteProperty} // استدعاء الدالة مع index و productId
              slug={slug}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
