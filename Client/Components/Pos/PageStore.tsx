"use client";

// REACT
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DNA } from "react-loader-spinner";
import Cookies from "js-cookie";

// COMPONENTS & STORE
import { RootState, AppDispatch } from "@/src/store";
import { fetchProducts } from "@/features/productSlice";
import { ProductStateType } from "@/features/productSlice";
import CartProduct from "@/Components/Pos/CartProduct";
import getSessionData, { SessionData } from "@/contexts/SessionContext";
import useSessionData from "@/hooks/useSessionData";

// NEXT UI

export default function PageStore() {
  const dispatch = useDispatch<AppDispatch>();
  const isInitialLoad = useRef(true);
  const sessionData = useSessionData();
  const colorCompany = Cookies.get("colorPos");

  const { products, loading } = useSelector(
    (state: RootState) => state.product
  ) as { products: ProductStateType["products"]; loading: boolean };
  const { searchKeyword } = useSelector((state: RootState) => state.pos);

  const AllProducts = products.map((product) => {
    const mainProductDetails = {
      _id: product._id,
      name: product.name,
      price: product.price,
      priceMarkter: product.priceMarkter,
      priceCustomer: product.priceCustomer,
      colors: product.colors,
      images: product.images,
      discrubtion: product.discrubtion,
      active: product.active,
      catogry: product.catogry,
      dateAdded: product.dateAdded,
      timeAdded: product.timeAdded,
      numberSelles: product.numberSelles,
      details: product.details,
    };

    const subProducts = product.products.map((subProduct) => ({
      _id: subProduct._id,
      name: subProduct.name,
      price: subProduct.price,
      priceMarkter: subProduct.priceMarkter,
      priceCustomer: subProduct.priceCustomer,
      colors: subProduct.colors,
      images: subProduct.images,
      discrubtion: subProduct.discrubtion,
      active: subProduct.active,
      catogry: subProduct.catogry,
      dateAdded: subProduct.dateAdded,
      timeAdded: subProduct.timeAdded,
      numberSelles: subProduct.numberSelles,
      details: subProduct.details,
    }));

    return [mainProductDetails, ...subProducts];
  });
  const flattenedProducts = AllProducts.flat().filter((p) =>
    p.name.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  useEffect(() => {
    if (isInitialLoad.current) {
      dispatch(fetchProducts());
      isInitialLoad.current = false;
    }
  }, [dispatch]);

  return (
    <>
      <div className="px-2 pt-5">
        {loading ? (
          <div className="flex items-center justify-center min-h-screen">
            <DNA
              visible={true}
              height="80"
              width="80"
              ariaLabel="dna-loading"
              wrapperStyle={{}}
              wrapperClass="dna-wrapper"
            />
          </div>
        ) : (
          <div className="w-full grid xl:grid-cols-6 lg:grid-cols-6 md:grid-cols-4 sm:grid-cols-2 max-sm:grid-cols-2 gap-2 mb-20">
            {flattenedProducts.length > 0 ? (
              flattenedProducts.map((product) => (
                <div className="bg-slate-50 border rounded-2xl">
                  <div className="relative block">
                    <img
                      src={product.images[0]}
                      alt={`صورة منتج ${product.name}`}
                      className="h-48 w-full object-cover rounded-t-2xl aspect-[16/9]"
                    />
                  </div>

                  <div className="w-full bg-white p-4 rounded-2xl">
                    <div className="flex items-center justify-between mb-2">
                      <div
                        className="flex font-semibold"
                        style={{ color: colorCompany }}
                      >
                        <span className="mr-1">د.ل</span>
                        <span>{product.priceCustomer}</span>
                      </div>
                      <div
                        dir="rtl"
                        className="block text-right font-semibold truncate whitespace-nowrap overflow-hidden text-ellipsis w-[50%]"
                        style={{ color: colorCompany }}
                      >
                        {product.name}
                      </div>
                    </div>

                    <p
                      className="whitespace-nowrap overflow-hidden text-ellipsis opacity-40 text-sm"
                      dir="rtl"
                    >
                      {product.discrubtion || "لا يوجد وصف"}
                    </p>
                    <div className="mt-3" dir="rtl">
                      {Array.from(
                        new Map(
                          product.details.map((item) => [item.color, item])
                        ).values()
                      ).map((uniqueItem, colorIndex) => (
                        <div key={colorIndex} className="mb-4">
                          <div className="flex items-center gap-2">
                            <p
                              className="w-7 h-7 rounded-xl border-2 border-white outline outline-2"
                              style={{
                                backgroundColor: uniqueItem.color,
                                outlineColor: uniqueItem.color,
                              }}
                            ></p>
                            <span className="ml-2 text-gray-700 font-semibold">
                              {uniqueItem.color}
                            </span>
                          </div>

                          <div className="mt-2 flex flex-col gap-y-2">
                            {uniqueItem.sizes
                              .filter(
                                (size) =>
                                  size.city === sessionData?.city &&
                                  size.store === sessionData?.store
                              )
                              .map((size, sizeIndex) => (
                                <div
                                  key={sizeIndex}
                                  className="flex justify-between items-center border border-gray-200 p-2 rounded-lg"
                                >
                                  <p className="text-gray-600">
                                    الحجم: {size.size}
                                  </p>
                                  <p className="text-gray-600">
                                    الكمية: {size.amount}
                                  </p>
                                </div>
                              ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className=" w-full h-screen flex justify-center items-center col-span-full text-sm opacity-55">
                لا توجد منتجات خالص .
              </p>
            )}
          </div>
        )}
      </div>
    </>
  );
}
