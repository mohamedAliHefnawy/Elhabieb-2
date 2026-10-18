"use client";

// REACT
import React from "react";

// COMPONENTS & STORE
import NavBar from "@/Components/Mat3er/NavBar";
import Footer from "@/Components/Mat3er/Footer";
import ButtonScroll from "@/Components/Mat3er/ButtonScroll";
import BodyOrders from "@/Components/Orders/PageOrders";

export default function Orders() {
  return (
    <>
      <NavBar />
      <BodyOrders />
      <Footer />
      <ButtonScroll />
    </>
  );
}
