"use client";

import React, { useEffect, useState } from "react";
import ReactStars from "react-stars";
import { usePathname } from "next/navigation";
import { ShoppingBasket } from "lucide-react";
import ButtonAddToCart from "./ButtonAddToCart";
import getSessionData, { SessionData } from "@/contexts/SessionContext";
import Cookies from "js-cookie";
import useSessionData from "@/hooks/useSessionData";

interface ProductDetails {
  color: string;
  sizes: {
    size: string;
    city: string;
    store: string;
    amount: number;
  }[];
}

interface CartProductProps {
  idProduct: string;
  nameProduct: string;
  priceProduct: number;
  priceCustomer: number;
  priceMarkter: number;
  colorsProduct: string[];
  imagesProduct: string[];
  discrubtionProduct: string;
  catogryProduct: string;
  numberSellesProduct: number;
  detailsProduct: ProductDetails[];
}

const CartProduct: React.FC<CartProductProps> = ({
  idProduct,
  nameProduct,
  priceProduct,
  priceCustomer,
  priceMarkter,
  colorsProduct,
  imagesProduct,
  discrubtionProduct,
  catogryProduct,
  numberSellesProduct,
  detailsProduct,
}) => {
  const path = usePathname();
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const sessionData = useSessionData();
  const colorCompany = Cookies.get("colorPos");

  const AvalibleAmonut = detailsProduct
    .find((item) => item.color === selectedColor)
    ?.sizes.find(
      (item2) =>
        item2.size === selectedSize &&
        item2.city === sessionData?.city &&
        item2.store === sessionData.store
    )?.amount;

  useEffect(() => {
    if (detailsProduct && detailsProduct.length > 0) {
      const defaultColor = detailsProduct[0].color;
      const defaulSize = detailsProduct[0].sizes[0].size;

      setSelectedColor(defaultColor);
      setSelectedSize(defaulSize);
    }
  }, [detailsProduct]);

  return (
    <div className="bg-slate-50 border rounded-2xl">
      <div className="relative block">
        <img
          src={
            imagesProduct && imagesProduct.length > 0
              ? imagesProduct[0]
              : undefined
          }
          alt={`صورة منتج ${nameProduct}`}
          className="h-48 w-full object-cover rounded-t-2xl aspect-[16/9]"
        />
      </div>

      <div className="w-full bg-white p-4 rounded-2xl">
        <div className="flex items-center justify-between mb-2">
          <div className="flex font-semibold " style={{ color: colorCompany }}>
            <span className="mr-1">د.ل</span>
            <span>{priceCustomer}</span>
          </div>
          <div
            dir="rtl"
            className="block text-right font-semibold truncate whitespace-nowrap overflow-hidden text-ellipsis w-[50%]"
            style={{ color: colorCompany }}
          >
            {nameProduct}
          </div>
        </div>

        <p
          className="whitespace-nowrap overflow-hidden text-ellipsis opacity-40 text-sm"
          dir="rtl"
        >
          {discrubtionProduct || "لا يوجد وصف"}
        </p>
        <div className="mt-3 flex justify-end gap-x-2">
          {detailsProduct.map((item) => (
            <>
              <div className="flex items-center justify-end">
                <p
                  className="w-7 h-7 rounded-xl cursor-pointer border-2 border-white outline outline-2"
                  style={{
                    backgroundColor: item.color,
                    outlineColor:
                      selectedColor === item.color ? item.color : "white",
                  }}
                  onClick={() => setSelectedColor(item.color)}
                ></p>
              </div>
            </>
          ))}
        </div>
        <div className="mt-3 flex justify-between items-center gap-x-2">
          <div>
            <ButtonAddToCart
              _id={idProduct}
              name={nameProduct}
              image={imagesProduct[0]}
              color={selectedColor}
              size={selectedSize}
              amount={0}
              price={priceCustomer}
              describtion={discrubtionProduct}
              amountAvalible={AvalibleAmonut || 0}
            />
          </div>
          <div className="flex justify-end items-center gap-x-2 ">
            {Array.from(
              new Set(
                detailsProduct.flatMap((item) =>
                  item.sizes.map((size) => size.size)
                )
              )
            ).map((uniqueSize, index) => (
              <p
                key={index}
                className={`p-2 border-1 rounded-xl cursor-pointer ${
                  selectedSize === uniqueSize && "bg-gray-50"
                }`}
                style={{
                  borderColor:
                    selectedSize === uniqueSize ? colorCompany : undefined,
                }}
                onClick={() => setSelectedSize(uniqueSize)}
              >
                {uniqueSize}
              </p>
            ))}
          </div>
        </div>

        {path === "/pos/products" && (
          <div className="flex justify-end items-center mt-3">
            <ReactStars
              count={5}
              value={4.5}
              size={24}
              edit={false}
              color1="#cccccc"
              color2={colorCompany}
            />
            <span className="opacity-60 text-sm ml-2">(100+)</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartProduct;
