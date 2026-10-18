"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "next/navigation";
import { Avatar, Spinner } from "@nextui-org/react";

import NavBar from "@/Components/Dashboard/NavBar";
import SideBar from "@/Components/Dashboard/SideBar";
import SizeScreen from "@/Components/Dashboard/SizeScreen";

import { RootState, AppDispatch } from "@/src/store";
import { fetchProductById } from "@/features/productSlice";

export default function Product() {
  const { slug } = useParams() || "";
  const dispatch = useDispatch<AppDispatch>();
  const { product, loading } = useSelector((state: RootState) => state.product);

  useEffect(() => {
    if (typeof slug === "string") {
      dispatch(fetchProductById(slug));
    }
  }, [dispatch, slug]);

  const DataProduct = () => (
    <div className="flex">
      <div className="w-[50%]">
        <div className="flex">
          <p className="ml-2 text-black opacity-50">كود المنتج :</p>
          <p className="opacity-95">{product?._id}</p>
        </div>
        <div className="flex my-5">
          <p className="ml-2 text-black opacity-50">الإسم :</p>
          <p className="opacity-95">{product?.name}</p>
        </div>
        <div className="flex my-5">
          <p className="ml-2 text-black opacity-50">التكلفة :</p>
          <p className="opacity-95">{product?.price}</p>
        </div>
        <div className="flex my-5">
          <p className="ml-2 text-black opacity-50">سعر البيع للمسوق :</p>
          <p className="opacity-95">{product?.priceMarkter}</p>
        </div>
        <div className="flex my-5">
          <p className="ml-2 text-black opacity-50">سعر البيع للزبون :</p>
          <p className="opacity-95">{product?.priceCustomer}</p>
        </div>
        <div className="flex my-5">
          <p className="ml-2 text-black opacity-50">القسم :</p>
          <p className="opacity-95">{product?.catogry}</p>
        </div>
        <div className="flex my-5">
          <p className="ml-2 text-black opacity-50">تاريخ الإضافة :</p>
          <p className="opacity-95">{product?.dateAdded}</p>
        </div>
        <div className="flex my-5">
          <p className="ml-2 text-black opacity-50">وقت الإضافة :</p>
          <p className="opacity-95">{product?.timeAdded}</p>
        </div>
      </div>
      <div>
        <div className="flex items-center my-5">
          <p className="ml-2 text-black opacity-50">الألوان :</p>
          <div className="opacity-95 flex gap-2">
            {product?.colors && product.colors.length > 0 ? (
              product.colors.map((item, k) => (
                <div key={k}>
                  <p
                    className="w-12 h-12 rounded-full border-2 border-white"
                    style={{
                      backgroundColor: item,
                      outline: `2px solid ${item}`,
                    }}
                  ></p>
                </div>
              ))
            ) : (
              <p>لا توجد أي ألوان</p>
            )}
          </div>
        </div>
        <div className="flex items-center my-5">
          <p className="ml-2 text-black opacity-50">الصور :</p>
          <div className="flex items-center">
            {product?.images.map((item, k) => (
              <div key={k} className="flex gap-3">
                <Avatar
                  className="outline-2 outline-slate-300"
                  src={item || "/default-image.png"}
                  size="md"
                />
              </div>
            ))}
          </div>
        </div>
        <div className="flex my-5">
          <p className="ml-2 text-black opacity-50">الوصف :</p>
          <p className="opacity-95">{product?.discrubtion}</p>
        </div>
      </div>
    </div>
  );

  const ProductsBranch = () => (
    <div>
      <div
        className="flex items-center p-4 mb-5 bg-[var(--color-body)] shadow-lg rounded-2xl text-black opacity-75"
        dir="rtl"
      >
        <div className="w-full flex justify-center text-black opacity-50">
          الصورة
        </div>
        <div className="w-full flex justify-center text-black opacity-50">
          الإسم
        </div>
        <div className="w-full flex justify-center text-black opacity-50">
          القسم
        </div>
        <div className="w-full flex justify-center text-black opacity-50">
          السعر
        </div>
        <div className="w-full flex justify-center text-black opacity-50">
          الكمية
        </div>
      </div>
      <div>
        {product?.products.map((item, k) => (
          <div
            key={k}
            className="flex items-center p-4 mb-2 bg-[var(--color-body)] shadow-lg rounded-2xl border-1 border-[var(--color-navbar)] text-black"
          >
            <div className="w-full flex justify-center">
              <Avatar
                className={`outline-2 ${
                  item.active ? "outline-green-800" : "outline-red-800"
                }`}
                src={item.images[0] || "/default-image.png"}
                size="lg"
              />
            </div>
            <div className="w-full flex justify-center opacity-75">
              <p>{item.name}</p>
            </div>
            <div className="w-full flex justify-center opacity-75">
              <p>{item.catogry}</p>
            </div>
            <div className="w-full flex justify-center opacity-75">
              <p>
                <span>{item.price}</span>
                <span className="mr-1">د.ل</span>
              </p>
            </div>
            <div className="w-full flex justify-center opacity-75">
              <p>
                <span>
                  {item.details.reduce((total, item2) => {
                    return (
                      total +
                      item2.sizes.reduce((calc, alt) => calc + alt.amount, 0)
                    );
                  }, 0)}
                </span>
                <span className="mr-1">قطعة</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const Body = () => (
    <div
      className="h-screen w-full bg-[var(--color-body)] border-1 border-[var(--color-navbar)] overflow-y-auto custom-scrollbar p-6 mt-1"
      dir="rtl"
    >
      <DataProduct />
      <ProductsBranch />
    </div>
  );

  return (
    <>
      <div className="w-full h-screen flex max-2xl:flex max-xl:flex lg:flex md:hidden sm:hidden max-sm:hidden">
        <div className="w-[84%] mr-1 flex flex-col">
          <NavBar />
          {loading ? (
            <div className="flex justify-center items-center h-[400px]">
              <Spinner size="lg" color="success" />
            </div>
          ) : (
            <Body />
          )}
        </div>
        <div className="w-[16%] flex flex-col">
          <SideBar />
        </div>
      </div>
      <SizeScreen />
    </>
  );
}
