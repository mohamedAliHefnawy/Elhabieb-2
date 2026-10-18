import React, { useEffect, useState } from "react";
import { Avatar, Checkbox } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import getSessionData, { SessionData } from "@/contexts/SessionContext";
import useSessionData from "@/hooks/useSessionData";

interface ProductsInCart {
  _id: string;
  category: string;
  color: string;
  images: string;
  name: string;
  price: number;
  priceCustomer: number;
  priceMarkter: number;
  gainMarkter: number;
  size: string;
}

interface ProductInCartProps {
  selectedItems: boolean[];
  handleSelectItem: (index: number) => void;
  products: ProductsInCart[];
}

export default function ProductInCart({
  selectedItems,
  handleSelectItem,
  products,
}: ProductInCartProps) {
  const sessionData = useSessionData();

  const DesginCardProduct = (
    index: number,
    image: string,
    name: string,
    category: string,
    size: string,
    color: string,
    price: number
  ) => {
    return (
      <div
        key={index}
        className="bg-[#F8FAFC] p-5 mt-1 flex items-center space-x-4"
      >
        <div>
          <Checkbox
            isSelected={selectedItems[index]}
            onChange={() => handleSelectItem(index)}
            className="text-3xl"
            color="warning"
          >
            <Avatar src={image} className="w-24 h-24" />
          </Checkbox>
        </div>
        <div className="overflow-hidden">
          <p className="text-ellipsis overflow-hidden whitespace-nowrap mb-1">
            {name}
          </p>
          <p className="mb-1">{category}</p>
          <div className="flex items-center mb-1">
            <p>{size}</p>
            <p
              style={{ backgroundColor: color }}
              className="w-4 h-4 rounded-full ml-2 opacity-60"
            ></p>
          </div>
          <div className="flex items-center">
            <p className="mr-1">د.ل</p>
            <p className="font-bold">{price}</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="grid xl:grid-cols-2 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 max-sm:grid-cols-1 gap-x-1">
        {products.map((item, index) =>
          DesginCardProduct(
            index,
            item.images,
            item.name,
            item.category,
            item.size,
            item.color,
            sessionData?.validity === "Markter"
              ? item?.priceMarkter
              : item?.priceCustomer
          )
        )}
      </div>
      <div>
        {products.length === 0 && (
          <p className="w-[100%] mt-24 opacity-60 flex justify-center items-center">
            لا توجد منتجات في السلة
          </p>
        )}
      </div>
    </>
  );
}
