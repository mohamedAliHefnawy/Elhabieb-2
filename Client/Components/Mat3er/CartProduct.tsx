"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import ModelShowProduct from "../Cart/ModelShowProduct";

import getSessionData, { SessionData } from "@/contexts/SessionContext";
import ButtonFav from "../Fav/ButtonFav";
import Image from "next/image";
import useSessionData from "@/hooks/useSessionData";

const CartProduct = ({
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
  products,
}: {
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
  detailsProduct: [
    {
      color: string;
      sizes: [
        {
          size: string;
          city: string;
          store: string;
          amount: number;
        }
      ];
    }
  ];
  products: {
    _id: string;
    properties: string[];
    name: string;
    price: number;
    priceMarkter: number;
    priceCustomer: number;
    colors: string[];
    images: string[];
    discrubtion: string;
    active: boolean;
    catogry: string;
    dateAdded: string;
    timeAdded: string;
    numberSelles: number;
    details: [
      {
        color: string;
        sizes: [
          {
            size: string;
            city: string;
            store: string;
            amount: number;
          }
        ];
      }
    ];
  }[];
}) => {
  const path = usePathname();
  const sessionData = useSessionData();

  const price =
    sessionData?.validity === "Markter" ? priceMarkter : priceCustomer;

  let href = "";

  if (path === "/Products") {
    href = `/Products/${encodeURIComponent(idProduct)}`;
  } else if (path === "/") {
    href = `/Products/${encodeURIComponent(idProduct)}`;
  } else if (path === "/fav") {
    href = `/Products/${encodeURIComponent(idProduct)}`;
  } else if (path.startsWith("/Categories/Category")) {
    href = `${path}/${encodeURIComponent(idProduct)}`;
  }

  return (
    <>
      <div className="bg-slate-50 border-1 rounded-2xl">
        <div className="relative block">
          <Image
            src={
              imagesProduct && imagesProduct.length > 0 ? imagesProduct[0] : ""
            }
            alt={`صورة منتج ${nameProduct}`}
            className="xl:h-52 lg:h-52 md:h-52 sm:h-40 max-sm:h-40 w-full object-cover rounded-t-2xl aspect-[16/9]"
            width={1920}
            height={1080}
          />
          <div className="absolute top-2 right-2 p-2 rounded-lg cursor-pointer text-[var(--color-matg3er-rgb)]">
            <p>
              <ButtonFav idProduct={idProduct} />
            </p>
          </div>
        </div>

        <div className="w-full bg-white p-4 rounded-2xl">
          <Link
            dir="rtl"
            href={href}
            className="block text-right text-lg font-semibold text-[var(--color-matg3er)] hover:text-[var(--color-matg3er-rgb)] truncate"
          >
            {nameProduct}
          </Link>

          <p
            className="whitespace-nowrap overflow-hidden text-ellipsis opacity-55"
            dir="rtl"
          >
            {discrubtionProduct ? (
              discrubtionProduct
            ) : (
              <span className="opacity-30">لا يوجد وصف</span>
            )}
          </p>

          <div className="flex items-center justify-between xl:py-4 lg:py-4 md:py-4 sm:py-0 max-sm:py-0 mt-2 rounded-2xl">
            <div className="flex items-baseline text-[var(--color-matg3er)]">
              <p className="mb-1 mr-1">د.ل</p>
              <p className="text-2xl">{price}</p>
            </div>
            <div className="hover:cursor-pointer hover:text-[var(--color-matg3er-rgb)] transition-colors">
              <ModelShowProduct
                idProduct={idProduct}
                nameProduct={nameProduct}
                priceProduct={priceProduct}
                priceCustomer={priceCustomer}
                priceMarkter={priceMarkter}
                colorsProduct={colorsProduct}
                imagesProduct={imagesProduct}
                discrubtionProduct={discrubtionProduct}
                catogryProduct={catogryProduct}
                numberSellesProduct={numberSellesProduct}
                detailsProduct={detailsProduct}
                products={products}
              />
            </div>
          </div>

          {/* <div className="flex items-center mt-3">
            <ReactStars
              count={5}
              value={4.5}
              size={24}
              edit={false}
              color1="#cccccc"
              color2="#ffc107"
            />
            <p className="opacity-60 text-sm ml-2">(100+)</p>
          </div> */}
        </div>
      </div>
    </>
  );
};

export default CartProduct;
