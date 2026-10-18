import Icons from "@/iconsSvg";
import { Checkbox } from "@nextui-org/react";
import React from "react";

interface SelectAllItemsProps {
  selectedAll: boolean;
  handleSelectAll: () => void;
  selectedCount: number;
  productsLenght: number;
  handleDeleteSelectedItems: () => void;
}

export default function SelectAllItems({
  selectedAll,
  handleSelectAll,
  selectedCount,
  productsLenght,
  handleDeleteSelectedItems,
}: SelectAllItemsProps) {
  return (
    <div className="bg-[#F8FAFC] p-5 flex justify-between items-center">
      <Checkbox
        isSelected={selectedAll}
        onChange={handleSelectAll}
        className="text-3xl"
        color="warning"
      >
        كل المنتجات ( {selectedCount} من {productsLenght} )
      </Checkbox>
      {selectedCount > 0 ? (
        <button
          onClick={handleDeleteSelectedItems}
          className="flex items-center text-red-600 hover:text-red-800"
        >
          {Icons.DeleteIcon}
          <span className="ml-2">حذف المحدد</span>
        </button>
      ) : (
        <div className="flex items-center text-red-600 hover:text-red-800 opacity-35">
          {Icons.DeleteIcon}
          <span className="ml-2">حذف المحدد</span>
        </div>
      )}
    </div>
  );
}
