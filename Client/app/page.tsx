"use client";

// REACT
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

// COMPONENTS & STORE
import { fetchCategories } from "@/features/categorySlice";
import { fetchProducts } from "@/features/productSlice";
import { RootState, AppDispatch } from "@/src/store";
import Banners from "@/Components/Mat3er/Banners";
import Catogries from "@/Components/Mat3er/Catogries";
import Footer from "@/Components/Mat3er/Footer";
import NavBar from "@/Components/Mat3er/NavBar";
import Products from "@/Components/Mat3er/Products";
import ProductsPageMain from "@/Components/Mat3er/ProductsPageMain";
import { fetchProductsInCartUser } from "@/features/cartSlice";
import useSessionData from "@/hooks/useSessionData";

export default function Home() {
  const sessionData = useSessionData();

  const dispatch = useDispatch<AppDispatch>();
  const isInitialLoad = useRef(true);
  const { categories } = useSelector((state: RootState) => state.category);
  const { products = [] } = useSelector((state: RootState) => state.product);

  useEffect(() => {
    if (isInitialLoad.current) {
      dispatch(fetchCategories());
      dispatch(fetchProducts());
      dispatch(fetchProductsInCartUser(sessionData?.email!));
      isInitialLoad.current = false;
    }
  }, [dispatch]);

  return (
    <>
      <NavBar />
      <Banners />
      <Catogries />
      <Products products={products} />
      {categories
        .filter((category) => category.Active !== false)
        .map((category) => {
          const filteredProducts = products.filter(
            (item) => item.catogry === category.name && item.active !== false
          );
          if (filteredProducts.length === 0) return null;
          return (
            <ProductsPageMain
              key={category.name}
              nameCatogry={category.name}
              products={filteredProducts}
            />
          );
        })}
      <div className="pt-20">
        <Footer />
      </div>
    </>
  );
}


