import React from "react";

export default function ProductColors({
  colors,
  selectedColor,
  setSelectedColor,
}: any) {
  return (
    <div className="mb-4">
      <h3 className="mb-2 opacity-70">الألوان المتاحة</h3>
      <div className="flex gap-2">
        {colors.map((color: any, i: number) => (
          <div
            key={i}
            onClick={() => setSelectedColor(color)}
            style={{ backgroundColor: color }}
            className={`w-10 h-10 rounded-full cursor-pointer transition-transform duration-300 ${
              selectedColor === color
                ? `border-2 border-transparent transform scale-125 shadow-lg`
                : "border-2 border-gray-300"
            }`}
            title={color} // إضافة عنوان لعرض اللون عند التحويم
          ></div>
        ))}
      </div>
    </div>
  );
}
