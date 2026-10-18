"use client";

// REACT
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ReactStars from "react-stars";
import Link from "next/link";

// COMPONENTS & STORE
import { fetchCategories } from "@/features/categorySlice";
import { RootState, AppDispatch } from "@/src/store";
import { Avatar, Spinner } from "@nextui-org/react";
import ButtonScroll from "@/Components/Mat3er/ButtonScroll";
import Footer from "@/Components/Mat3er/Footer";
import NavBar from "@/Components/Mat3er/NavBar";

const CategoryCard = ({
  image,
  name,
  link,
  numberProducts,
}: {
  image: string;
  name: string;
  link: string;
  numberProducts: number;
}) => (
  <Link
    href={link}
    className="p-4 rounded-3xl border border-[var(--color-matg3er-rgb)] border-opacity-25 flex flex-col items-center"
  >
    <Avatar src={image} className="w-20 h-20 bg-transparent" />
    <div className="flex mt-3 text-ellipsis overflow-hidden whitespace-nowrap">
      <p>علي {numberProducts} منتج</p>
      <p className="text-[var(--color-matg3er)] mx-1">{name}</p>
      <p className="ml-1">يحتوي قسم</p>
    </div>
    <div className="flex items-center opacity-75">
      <ReactStars
        count={5}
        value={4.5}
        size={24}
        edit={false}
        color1="#cccccc"
        color2="#ffc107"
      />
      <p dir="rtl" className="text-sm opacity-75 ml-2">
        متوسط التقييمات
      </p>
    </div>
  </Link>
);

export default function AllCategories() {
  const dispatch = useDispatch<AppDispatch>();
  const isInitialLoad = useRef(true);
  const { categories, loading } = useSelector(
    (state: RootState) => state.category
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");

  const handleSearch = (e: any) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterChange = (filter: any) => {
    setSelectedFilter(filter);
  };

  const filterOptions = Array.from(
    new Set(
      categories
        .filter((item) => item.Active !== false)
        .map((category) => category.name)
    )
  );

  const filteredCategories = categories.filter(
    (category) =>
      category.Active !== false &&
      category.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (selectedFilter === "all" || category.name === selectedFilter)
  );

  useEffect(() => {
    if (isInitialLoad.current) {
      dispatch(fetchCategories());
      isInitialLoad.current = false;
    }
  }, [dispatch]);

  return (
    <>
      <NavBar />

      <div className="px-2 pt-5">
        <div className="mb-4 xl:pt-20 lg:pt-20 md:pt-20 sm:pt-[60px] max-sm:pt-[60px]">
          <input
            type="text"
            placeholder="ابحث عن قسم ..."
            value={searchQuery}
            onChange={handleSearch}
            className="input"
          />
        </div>
        <div className="flex justify-start gap-x-2 mb-4 overflow-x-auto scrollbar-hide px-1">
          <button
            onClick={() => handleFilterChange("all")}
            className={`h-12 px-4 py-2 border rounded-3xl ${
              selectedFilter === "all"
                ? "bg-[var(--color-matg3er-rgb)] text-white"
                : "bg-white text-[var(--color-matg3er-rgb)]"
            }`}
          >
            الأقسام
          </button>
          {filterOptions.map((option) => (
            <button
              key={option}
              onClick={() => handleFilterChange(option)}
              className={` h-12 px-4 py-2 border rounded-3xl text-ellipsis whitespace-nowrap ${
                selectedFilter === option
                  ? "bg-[var(--color-matg3er-rgb)] text-white"
                  : "bg-white text-[var(--color-matg3er-rgb)]"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
        <div className=" w-full grid xl:grid-cols-5 lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-1 gap-1 mb-20">
          {filteredCategories.map((category, index) => (
            <>
              <CategoryCard
                key={index}
                image={category.image}
                name={category.name}
                link={`/Categories/Category/${encodeURIComponent(
                  category.name
                )}`}
                numberProducts={category.products.length}
              />
            </>
          ))}
        </div>
      </div>
      <Footer />
      <ButtonScroll />
    </>
  );
}
