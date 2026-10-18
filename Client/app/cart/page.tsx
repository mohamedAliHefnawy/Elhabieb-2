"use client";

// REACT
import React from "react";

// COMPONENTS & STORE
import NavBar from "@/Components/Mat3er/NavBar";
import Footer from "@/Components/Mat3er/Footer";
import ButtonScroll from "@/Components/Mat3er/ButtonScroll";
import BodyCart from "@/Components/Cart/Body";

export default function Cart() {
  return (
    <>
      <NavBar />
      <BodyCart />
      <Footer />
      <ButtonScroll />
    </>
  );
}
