import Icons from "@/iconsSvg";
import { Avatar, Tab, Tabs } from "@nextui-org/react";
import { useState } from "react";
import PreviousWork2 from "@/public/images/product2.png";
import { motion } from "framer-motion";
import ReactStars from "react-stars";

export default function ProductSizes({
  sizes,
  selectedSize,
  setSelectedSize,
}: any) {
  return (
    <div className="mb-4">
      <h3 className="mb-2 opacity-70">الأحجام المتاحة </h3>
      <div className="flex gap-1">
        {sizes.length > 0 ? (
          sizes.map((size: any, idx: any) => (
            <button
              key={idx}
              onClick={() => setSelectedSize(size)}
              className={`px-4 py-2 rounded-md border ${
                selectedSize === size ? "bg-[var(--color-matg3er)] text-white" : "bg-gray-200"
              }`}
            >
              {size}
            </button>
          ))
        ) : (
          <p className="text-red-600">غير متوفر أحجام لهذا اللون</p>
        )}
      </div>
    </div>
  );
}
