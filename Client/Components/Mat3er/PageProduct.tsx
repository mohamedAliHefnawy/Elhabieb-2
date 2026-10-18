"use client";

import React, { useEffect, useRef, useState } from "react";
import NavBar from "@/Components/Mat3er/NavBar";
import Footer from "@/Components/Mat3er/Footer";
import ButtonScroll from "@/Components/Mat3er/ButtonScroll";
import Icons from "@/iconsSvg";
import { Tab, Tabs } from "@nextui-org/react";
import ProductImages from "./TiesPageProducts.tsx/productImages";
import ProductSizes from "./TiesPageProducts.tsx/productSizes";
import ProductColors from "./TiesPageProducts.tsx/productColors";
import AddComment from "./AddComment";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/src/store";
import { fetchProductById } from "@/features/productSlice";
import ButtonCart from "../Cart/ButtonCart";
import Alert from "../Alert";
import getSessionData, { SessionData } from "@/contexts/SessionContext";
import { Heart, ShoppingCart } from "lucide-react";
import ButtonFav from "../Fav/ButtonFav";
import useSessionData from "@/hooks/useSessionData";

const PageProduct = ({ slug }: { slug: string }) => {
  const sessionData = useSessionData();

  const dispatch = useDispatch<AppDispatch>();
  const isInitialLoad = useRef(true);
  const { product, loading } = useSelector((state: RootState) => state.product);

  const colorsArray = Array.isArray(product?.colors) ? product.colors : [];
  const productsArray = Array.isArray(product?.products)
    ? product?.products
    : [];
  const imagesArray = Array.isArray(product?.images) ? product.images : [];

  const AllColors = Array.from(
    new Set([
      ...colorsArray,
      ...productsArray.flatMap((product) => product.colors || []),
    ])
  );

  const AllImages = Array.from(
    new Set([
      ...imagesArray,
      ...productsArray.flatMap((product) => product.images || []),
    ])
  );

  const [selectedColor, setSelectedColor] = useState(AllColors[0]);

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const foundProduct = (() => {
    const isColorInColorsProduct = colorsArray.includes(selectedColor);
    if (isColorInColorsProduct) {
      return {
        idProduct: product?._id,
        priceProduct:
          sessionData?.validity === "Markter"
            ? product?.priceMarkter
            : product?.priceCustomer,
        discrubtionProduct: product?.discrubtion,
        sizesProduct: product?.details.map((item) => item.sizes),
      };
    } else {
      const product = productsArray.find((item) =>
        item.colors.find((color: any) => color === selectedColor)
      );
      return {
        idProduct: product?._id,
        priceProduct:
          sessionData?.validity === "Markter"
            ? product?.priceMarkter
            : product?.priceCustomer,
        discrubtionProduct: product?.discrubtion,
        sizesProduct: product?.details.map((item) => item.sizes),
      };
    }
  })();

  const SizesAvalible = Array.from(
    new Set(
      foundProduct.sizesProduct?.flatMap((sizesArray: any) =>
        sizesArray.map((sizeItem: any) => sizeItem.size)
      ) || []
    )
  );

  const [selectedSize, setSelectedSize] = useState(
    SizesAvalible.length > 0 ? SizesAvalible[0] : ""
  );

  const allSizes = Array.from(
    new Set(
      foundProduct.sizesProduct?.reduce((acc: any[], item: any) => {
        if (Array.isArray(item)) {
          item.forEach((innerItem: any) => {
            if (innerItem.size) {
              acc.push(innerItem.size);
            }
          });
        }
        return acc;
      }, []) || []
    )
  );

  const showMessage = () => {
    Alert("warning", "يجب إختيار حجم أولا إذا كان متوفرا");
    new Audio("/mp3/mustChooseSize.mp3").play();
  };

  useEffect(() => {
    if (isInitialLoad.current) {
      dispatch(fetchProductById(slug));
      isInitialLoad.current = false;
    }
  }, [dispatch]);

  useEffect(() => {
    if (product) {
      setSelectedColor(AllColors[0]);
    }
  }, [product]);

  return (
    <div>
      <NavBar />
      <div className="mx-auto xl:pt-20 lg:pt-20 md:pt-20 sm:pt-14 max-sm:pt-14 ">
        <div
          className="xl:flex lg:flex md:flex xl:px-32 lg:px-32 md:px-32 sm:px-2 max-sm:px-2"
          dir="rtl"
        >
          <ProductImages
            images={AllImages}
            selectedImageIndex={selectedImageIndex}
            setSelectedImageIndex={setSelectedImageIndex}
          />
          <div className="mt-5 mr-4 xl:w-[50%] lg:w-[50%] md:w-[50%] sm:w-[100%] max-sm:w-[100%]">
            <div className="flex items-end text-[var(--color-matg3er)]">
              <p className="text-5xl">
                {foundProduct.priceProduct?.toFixed(2)}
              </p>
              <p className="mb-1 mr-1">د.ل</p>
            </div>
            <p className="text-gray-700 mb-6 mt-2">{product?.name}</p>
            <ProductColors
              colors={AllColors}
              selectedColor={selectedColor}
              setSelectedColor={(color: string) => {
                setSelectedColor(color);
                setSelectedSize("");
              }}
            />
            <ProductSizes
              sizes={allSizes}
              selectedSize={selectedSize}
              setSelectedSize={setSelectedSize}
            />

            <div className="mt-6 mr-3 flex gap-7">
              <div className="hover:cursor-pointer hover:text-[var(--color-matg3er-rgb)]">
                {SizesAvalible.length > 0 ? (
                  selectedSize !== "" ? (
                    <ButtonCart
                      idProduct={foundProduct.idProduct as string}
                      colorProduct={selectedColor}
                      sizeProduct={selectedSize}
                    />
                  ) : (
                    <p onClick={showMessage} className="hover:text-red-600">
                      <ShoppingCart size={28} strokeWidth={1} />
                    </p>
                  )
                ) : (
                  <p onClick={showMessage} className="hover:text-red-600">
                    <ShoppingCart size={28} strokeWidth={1} />
                  </p>
                )}
              </div>
              <div className="hover:cursor-pointer hover:text-[var(--color-matg3er-rgb)]">
                <ButtonFav idProduct={slug} />
              </div>
            </div>

            <div className="mt-7 px-2">
              <h3 className="mb-2 opacity-70">وصف المنتج</h3>

              <p>{foundProduct.discrubtionProduct}</p>
            </div>
          </div>
        </div>
        <div className="w-full mt-8">
          <Tabs
            className="w-full"
            color="warning"
            variant="underlined"
            dir="rtl"
          >
            <Tab
              title={
                <div className="flex flex-col justify-center items-center gap-y-1 h-12">
                  <p>تقييمات المنتج</p>
                  <p>{Icons.StarIcon}</p>
                </div>
              }
            >
              <p className="w-[100%] flex justify-center opacity-60">
                يتم العمل عليها
              </p>
              {/* <div className="grid xl:grid-cols-4 lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 max-sm:grid-cols-1 gap-2 p-4 overflow-auto">
                <ProductReviews rating={2} />
                <ProductReviews rating={3} />
                <ProductReviews rating={6} />
                <ProductReviews rating={5} />
                <ProductReviews rating={2} />
                <ProductReviews rating={3} />
                <ProductReviews rating={6} />
                <ProductReviews rating={5} />
              </div> */}
            </Tab>
            <Tab className="h-16" title={<AddComment where="Categories" />} />
          </Tabs>
        </div>
        <div className="clear-both pb-36">
          <p className="text-right mr-6 opacity-55">بعض المنتجات المشابهه</p>

          <p className="w-[100%] flex justify-center opacity-60">
            يتم العمل عليها
          </p>

          {/* <SomeProducts /> */}
        </div>
      </div>
      <Footer />
      <ButtonScroll />
    </div>
  );
};

export default PageProduct;
