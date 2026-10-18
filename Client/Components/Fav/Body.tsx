"use client";

// REACT
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

// COMPONENTS & STORE
import { RootState, AppDispatch } from "@/src/store";
import Footer from "@/Components/Mat3er/Footer";
import NavBar from "@/Components/Mat3er/NavBar";
import CartProduct from "@/Components/Mat3er/CartProduct";

// NEXT UI
import { Slider } from "@nextui-org/react";
import { fetchProductsInFavUser, Product } from "@/features/favSlice";
import getSessionData, { SessionData } from "@/contexts/SessionContext";
import Alert from "../Alert";
import { RefreshCcw, Trash2 } from "lucide-react";
import useSessionData from "@/hooks/useSessionData";

export default function BodyFav() {
  const dispatch = useDispatch<AppDispatch>();
  const isInitialLoad = useRef(true);
  const sessionData = useSessionData();

  const { Products, loading, error } = useSelector(
    (state: RootState) => state.fav
  );

  // if (error) {
  //   Alert("error", "توجد مشكلة في الإنترنت حاول تنشيط الصفحة");
  //   new Audio("/mp3/proplemInternet.mp3").play();
  //   return;
  // }

  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handlePriceChange = (values: number | number[]) => {
    if (Array.isArray(values)) {
      setPriceRange(values as [number, number]);
    }
  };

  const filteredProducts = Products.filter(
    (product) =>
      product.name &&
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      product.price >= priceRange[0] &&
      product.price <= priceRange[1]
  );

  const FetchProducts = () => {
    if (sessionData) {
      dispatch(fetchProductsInFavUser(sessionData.email));
    }
  };

  useEffect(() => {
    if (isInitialLoad.current && sessionData) {
      dispatch(fetchProductsInFavUser(sessionData.email));
      isInitialLoad.current = false;
    }
  }, [dispatch, sessionData]);

  useEffect(() => {
    if (Products) {
      setAllProducts(Products);
    }
  }, [Products]);

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
              minValue={0}
              maxValue={100000}
              defaultValue={priceRange}
              onChange={handlePriceChange}
              formatOptions={{ style: "currency", currency: "LYD" }}
              className="w-full"
            />
          </div>

          <div
            onClick={FetchProducts}
            className="flex justify-center opacity-65 my-5 cursor-pointer"
          >
            <p className="mr-2">تنشيط الصفحة</p>
            <RefreshCcw strokeWidth={1} />
          </div>
        </div>

        {loading ? (
          <></>
        ) : (
          <div className="w-full grid xl:grid-cols-6 lg:grid-cols-6 md:grid-cols-4 sm:grid-cols-2 max-sm:grid-cols-2 gap-1 mb-20">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <div className="flex flex-col items-end" key={product._id}>
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
                </div>
              ))
            ) : (
              <p className="text-center col-span-full text-sm opacity-55">
                لا توجد منتجات مطابقة
              </p>
            )}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
