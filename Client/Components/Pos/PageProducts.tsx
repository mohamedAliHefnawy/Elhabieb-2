"use client";

// REACT
import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DNA } from "react-loader-spinner";
import Cookies from "js-cookie";
// COMPONENTS & STORE
import { RootState, AppDispatch } from "@/src/store";
import { fetchProducts } from "@/features/productSlice";
import { ProductStateType } from "@/features/productSlice";
import CartProduct from "@/Components/Pos/CartProduct";

// NEXT UI

export default function PageProducts() {
  const dispatch = useDispatch<AppDispatch>();
  const isInitialLoad = useRef(true);
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
                <CartProduct
                  key={product._id}
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
                />
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
