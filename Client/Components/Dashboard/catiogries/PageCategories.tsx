"use client";

// REACT
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";

// NEXT UI
import { Avatar, Spinner } from "@nextui-org/react";

// COMPONENTS & STORE
import { fetchCategories } from "@/features/categorySlice";
import { RootState, AppDispatch } from "@/src/store";
import Icons from "@/iconsSvg";

const PageCategories: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const isInitialLoad = useRef(true);

  const [searchQuery, setSearchQuery] = useState<string>("");
  const { categories, loading } = useSelector(
    (state: RootState) => state.category
  );

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Header Filters Component
  const HeaderFilters = () => (
    <div className="flex flex-col mb-4">
      <div className="flex justify-between items-center mb-4">
        <Link
          className="flex items-center gap-x-2 bg-[var(--color-navbar)] h-12 w-[12%]  mr-1 p-2 rounded-xl "
          href="/dashboard/categories/add"
        >
          <p>{Icons.PlusIcon}</p>
          <p>إضافة قسم</p>
        </Link>
        <div className="w-full">
          <input
            className="w-full input"
            type="text"
            placeholder="بحث ..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      <div className="mr-2 text-black opacity-60 text-sm flex justify-end">
        <p>total {filteredCategories.length} Categories</p>
      </div>
    </div>
  );

  const HeaderTableOrders = () => (
    <div
      className="flex items-center p-4 mb-5 bg-[var(--color-body)] shadow-lg rounded-2xl text-black opacity-75"
      dir="rtl"
    >
      {["الصورة", "الإسم", "عدد المنتجات", "الحالة", "-"].map(
        (header, index) => (
          <div
            key={index}
            className="w-full flex justify-center text-black opacity-50"
          >
            {header}
          </div>
        )
      )}
    </div>
  );

  const TableOrders = () => (
    <>
      {filteredCategories.length === 0 ? (
        <div className="flex justify-center items-center h-[400px] text-black opacity-50">
          <p>لا يوجد أي أقسام</p>
        </div>
      ) : (
        filteredCategories.map((category) => (
          <div
            key={category._id}
            className="flex items-center p-4 mb-2 bg-[var(--color-body)] shadow-lg rounded-2xl border border-[var(--color-navbar)] text-black"
          >
            <div className="w-full flex justify-center">
              <Avatar
                className={`outline-2 ${
                  category.Active ? "outline-green-800" : "outline-red-800"
                }`}
                src={category.image || "/default-image.png"}
                size="lg"
              />
            </div>
            <div className="w-full flex justify-center opacity-75">
              <p>{category.name}</p>
            </div>
            <div className="w-full flex justify-center opacity-75">
              <p>{category.products.length}</p>
            </div>
            <div className="w-full flex justify-center opacity-75">
              <p
                className={
                  category.Active ? "text-success-500" : "text-red-500"
                }
              >
                {category.Active ? "نشط" : "غير نشط"}
              </p>
            </div>
            <div className="w-full flex justify-center opacity-75">
              <Link href={`/dashboard/categories/edit/${category._id}`}>
                <p className="hover:cursor-pointer hover:opacity-75 p-3 rounded-full">
                  {Icons.PencilIcon}
                </p>
              </Link>
            </div>
          </div>
        ))
      )}
    </>
  );

  useEffect(() => {
    if (isInitialLoad.current) {
      dispatch(fetchCategories());
      isInitialLoad.current = false;
    }
  }, [dispatch]);

  return (
    <div className="h-screen w-full bg-[var(--color-body)] border border-[var(--color-navbar)] overflow-y-auto custom-scrollbar p-6 mt-1">
      {HeaderFilters()}
      {HeaderTableOrders()}
      <div dir="rtl">
        {loading ? (
          <div className="flex justify-center items-center h-[400px]">
            <Spinner size="lg" color="success" />
          </div>
        ) : (
          <TableOrders />
        )}
      </div>
    </div>
  );
};

export default PageCategories;
