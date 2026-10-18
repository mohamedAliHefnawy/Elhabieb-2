"use client";

// REACT
import React from "react";
import Link from "next/link";

// COMPONENTS & STORE
import CartProduct from "@/Components/Mat3er/CartProduct";
import { ProductStateType } from "@/features/productSlice";

const ProductsPageMain = ({
  nameCatogry,
  products,
}: {
  nameCatogry: string;
  products: ProductStateType["products"];
}) => {
  return (
    <>
      <div className="flex justify-end mr-1 mt-2 mb-3">
        <Link
          className="bg-[var(--color-matg3er-rgb)] p-3 rounded-full hover:bg-[var(--color-matg3er)] text-white"
          href={`/Categories/Category/${nameCatogry}`}
          dir="rtl"
        >
          {nameCatogry}
        </Link>
      </div>
      <div className="">
        <div className="grid xl:grid-cols-6 lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-2 max-sm:grid-cols-2 gap-1">
          {products &&
            products.length > 0 &&
            products.filter((product) => product.active === true) &&
            products.map((product, index) => (
              <div key={index} className="">
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
            ))}
        </div>
      </div>
    </>
  );
};

export default ProductsPageMain;
