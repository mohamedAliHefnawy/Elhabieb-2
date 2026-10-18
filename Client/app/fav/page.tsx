"use client";

// REACT
import React, { useEffect, useRef } from "react";

// COMPONENTS & STORE
import NavBar from "@/Components/Mat3er/NavBar";
import Footer from "@/Components/Mat3er/Footer";
import BodyFav from "@/Components/Fav/Body";

export default function Fav() {
  return (
    <>
      <NavBar />
      <BodyFav />
      <Footer />
    </>
  );
}
