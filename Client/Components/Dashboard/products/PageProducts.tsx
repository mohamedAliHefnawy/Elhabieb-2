"use client";

// REACT
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";

// COMPONENTS & STORE
import { RootState, AppDispatch } from "@/src/store";
import { fetchProducts } from "@/features/productSlice";
import Icons from "@/iconsSvg";

// NEXT UI
import { Button, Avatar, Spinner } from "@nextui-org/react";

const PageProducts: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const isInitialLoad = useRef(true);

  const [searchQuery, setSearchQuery] = useState<string>("");
  const { products = [], loading } = useSelector(
    (state: RootState) => state.product
  );

  const filteredProducts = (products || []).filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const HeaderFilters = () => (
    <div className="flex flex-col mb-10">
      <div className="flex justify-between items-center mb-4">
        <Link
          className="flex items-center gap-x-2 bg-[var(--color-navbar)] h-12 w-[12%]  mr-1 p-2 rounded-xl "
          href="/dashboard/products/add"
        >
          <p>{Icons.PlusIcon}</p>
          <p>إضافة منتج</p>
        </Link>
        <div className="w-[100%]">
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
        <p>Total {filteredProducts.length} Products</p>
      </div>
    </div>
  );

  const HeaderTableProducts = () => (
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
        المنتجات الفرعية
      </div>
      <div className="w-full flex justify-center text-black opacity-50">
        السعر
      </div>
      <div className="w-full flex justify-center text-black opacity-50">
        الكمية
      </div>

      <div className="w-full flex justify-center">-</div>
    </div>
  );

  // # Table Products
  const TableProducts = () => (
    <>
      {filteredProducts.length === 0 ? (
        <div className="flex justify-center items-center h-[400px] text-black opacity-50">
          <p>لا يوجد أي منتجات</p>
        </div>
      ) : (
        filteredProducts.map((product) => (
          <div
            key={product._id}
            className="flex items-center p-4 mb-2 bg-[var(--color-body)] shadow-lg rounded-2xl border-1 border-[var(--color-navbar)] text-black"
          >
            <div className="w-full flex justify-center">
              <Avatar
                className={`outline-2 ${
                  product.active ? "outline-green-800" : "outline-red-800"
                }`}
                src={product.images[0] || "/default-image.png"}
                size="lg"
              />
            </div>
            <div className="w-full flex justify-center opacity-75">
              <p>{product.name}</p>
            </div>
            <div className="w-full flex justify-center opacity-75">
              <p>{product.catogry}</p>
            </div>
            <div className="w-full flex justify-center opacity-75">
              <p>{product.products.length}</p>
            </div>
            <div className="w-full flex justify-center opacity-75">
              <p>
                <span>{product.price}</span>
                <span className="mr-1">د.ل</span>
              </p>
            </div>
            <div className="w-full flex justify-center opacity-75">
              <p>
                <span>
                  {product.details.reduce((total, item) => {
                    return (
                      total +
                      item.sizes.reduce((calc, alt) => calc + alt.amount, 0)
                    );
                  }, 0)}
                </span>
                <span className="mr-1">قطعة</span>
              </p>
            </div>
            <div className="w-full flex justify-center opacity-75">
              <Link href={`/dashboard/products/edit/${product._id}`}>
                <p className="hover:cursor-pointer hover:opacity-75 p-3 rounded-full">
                  {Icons.PencilIcon}
                </p>
              </Link>
              <Link href={`/dashboard/products/${product._id}`}>
                <p className="hover:cursor-pointer hover:opacity-75 p-3 rounded-full">
                  {Icons.EyeIcon}
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
      dispatch(fetchProducts());
      isInitialLoad.current = false;
    }
  }, [dispatch]);

  return (
    <div className="h-screen w-full bg-[var(--color-body)] border-1 border-[var(--color-navbar)] overflow-y-auto custom-scrollbar p-6 mt-1">
      {HeaderFilters()}
      <HeaderTableProducts />
      <div dir="rtl">
        {loading ? (
          <div className="flex justify-center items-center h-[400px]">
            <Spinner size="lg" color="success" />
          </div>
        ) : (
          <TableProducts />
        )}
      </div>
    </div>
  );
};

export default PageProducts;
