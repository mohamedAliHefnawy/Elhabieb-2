"use client";

// REACT
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { usePathname } from "next/navigation";

// COMPONENTS & STORE
import { fetchProductsInCatiogries } from "@/features/productSlice";
import { ProductStateType } from "@/features/productSlice";
import { RootState, AppDispatch } from "@/src/store";
import ButtonScroll from "@/Components/Mat3er/ButtonScroll";
import Footer from "@/Components/Mat3er/Footer";
import NavBar from "@/Components/Mat3er/NavBar";
import CartProduct from "@/Components/Mat3er/CartProduct";

// NEXT UI
import { Slider } from "@nextui-org/react";

export default function AllCategories() {
  const dispatch = useDispatch<AppDispatch>();
  const isInitialLoad = useRef(true);
  const { products, loading } = useSelector(
    (state: RootState) => state.product
  ) as { products: ProductStateType["products"]; loading: boolean };

  const path = usePathname();
  const decodedPath = decodeURIComponent(path);
  const lastSegment = decodedPath.split("/").pop() as string;

  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>([1, 100000]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handlePriceChange = (values: number | number[]) => {
    if (Array.isArray(values)) {
      setPriceRange(values as [number, number]);
    }
  };

  const filteredProducts = products.filter(
    (product) =>
      product.active !== false &&
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      product.price >= priceRange[0] &&
      product.price <= priceRange[1]
  );

  useEffect(() => {
    if (isInitialLoad.current) {
      dispatch(fetchProductsInCatiogries(lastSegment));
      isInitialLoad.current = false;
    }
  }, [dispatch]);

  return (
    <>
      <NavBar />
      <div className="pt-5">
        <div className="mb-4 xl:pt-20 lg:pt-20 md:pt-20 sm:pt-[60px] max-sm:pt-[60px]">
          <input
            type="text"
            placeholder="ابحث عن منتج ..."
            value={searchQuery}
            onChange={handleSearch}
            className="input text-sm w-full p-2 border border-gray-300 rounded-md"
          />
          <div className="my-3 w-full px-4">
            <Slider
              label="رينج الاسعار"
              color="warning"
              size="sm"
              step={1}
              minValue={1}
              maxValue={100000}
              defaultValue={priceRange}
              onChange={handlePriceChange}
              formatOptions={{ style: "currency", currency: "LYD" }}
              className="w-full"
            />
          </div>
        </div>

        <div className="w-full grid xl:grid-cols-6 lg:grid-cols-6 md:grid-cols-4 sm:grid-cols-2 max-sm:grid-cols-2 gap-1 mb-20">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <CartProduct
                idProduct={product._id}
                nameProduct={product.name}
                priceProduct={product.price}
                priceCustomer={product.priceCustomer}
                priceMarkter={product.priceMarkter}
                colorsProduct={product.colors}
                imagesProduct={product.images}
                discrubtionProduct={product.discrubtion}
                catogryProduct={product.catogry}
                numberSellesProduct={product.numberSelles}
                detailsProduct={product.details}
                products={product.products}
              />
            ))
          ) : (
            <p className="text-center col-span-full text-sm opacity-55">
              لا توجد منتجات مطابقة
            </p>
          )}
        </div>
      </div>
      <Footer />
      <ButtonScroll />
    </>
  );
}
