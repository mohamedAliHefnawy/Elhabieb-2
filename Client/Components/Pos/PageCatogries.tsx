"use client";

// REACT
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ReactStars from "react-stars";
import { DNA } from "react-loader-spinner";
import Cookies from "js-cookie";
// COMPONENTS & STORE
import { fetchCategories } from "@/features/categorySlice";
import { RootState, AppDispatch } from "@/src/store";
import { Avatar } from "@nextui-org/react";
import Alert from "../Alert";

const colorCompany = Cookies.get("colorPos");

const CategoryCard = ({
  image,
  name,
  numberProducts,
}: {
  image: string;
  name: string;
  numberProducts: number;
}) => (
  <div
    className="p-4 rounded-3xl border border-opacity-70 flex flex-col items-center"
    style={{ borderColor: colorCompany }}
  >
    <Avatar src={image} className="w-20 h-20 bg-transparent" />
    <div className="flex mt-3 text-ellipsis overflow-hidden whitespace-nowrap">
      <p>علي {numberProducts} منتج</p>
      <p className="mx-1" style={{ color: colorCompany }}>
        {name}
      </p>
      <p className="ml-1">يحتوي قسم</p>
    </div>
    <div className="flex items-center opacity-75">
      <ReactStars
        count={5}
        value={4.5}
        size={24}
        edit={false}
        color1="#cccccc"
        color2={colorCompany}
      />
      <p dir="rtl" className="text-sm opacity-75 ml-2">
        متوسط التقييمات
      </p>
    </div>
  </div>
);

export default function PageCatogries() {
  const dispatch = useDispatch<AppDispatch>();
  const isInitialLoad = useRef(true);

  const { categories, loading, error } = useSelector(
    (state: RootState) => state.category
  );
  const { searchKeyword } = useSelector((state: RootState) => state.pos);

  if (error) {
    Alert("error", "توجد مشكلة في الإنترنت حاول تنشيط الصفحة");
    new Audio("/mp3/proplemInternet.mp3").play();
    return;
  }

  useEffect(() => {
    if (isInitialLoad.current) {
      dispatch(fetchCategories());
      isInitialLoad.current = false;
    }
  }, [dispatch]);

  return (
    <>
      <div className="px-2 pt-5 relative min-h-screen">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <DNA
              visible={true}
              height="80"
              width="80"
              ariaLabel="dna-loading"
            />
          </div>
        ) : (
          <div className="w-full grid xl:grid-cols-5 lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-1 gap-1 mb-20">
            {categories
              .filter((item) => item.Active === true)
              .filter((item) =>
                item.name.toLowerCase().includes(searchKeyword.toLowerCase())
              )
              .map((category, index) => (
                <CategoryCard
                  key={index}
                  image={category.image}
                  name={category.name}
                  numberProducts={category.products.length}
                />
              ))}

            {categories
              .filter((item) => item.Active === true)
              .filter((item) =>
                item.name.toLowerCase().includes(searchKeyword.toLowerCase())
              ).length === 0 && (
              <p className=" w-full h-screen flex justify-center items-center col-span-full text-sm opacity-55">
                . لا توجد أقسام خالص
              </p>
            )}
          </div>
        )}
      </div>
    </>
  );
}
