import Icons from "@/iconsSvg";
import { Avatar, Tab, Tabs } from "@nextui-org/react";
import { useState } from "react";
import PreviousWork2 from "@/public/images/product2.png";
import { motion } from "framer-motion";
import ReactStars from "react-stars";

export default function ProductImages({
  images,
  selectedImageIndex,
  setSelectedImageIndex,
}: any) {
  const handlePrevImage = () => {
    setSelectedImageIndex((prevIndex: any) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const handleNextImage = () => {
    setSelectedImageIndex((prevIndex: any) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="xl:w-[50%] lg:w-[50%] md:w-[50%] sm:w-[100%] max-sm:w-[100%]">
      <div className="mb-4 flex items-center justify-center gap-2 w-full ">
        {/* <button
          onClick={handlePrevImage}
          className="p-2 rounded-full z-10 -rotate-90 xl:flex lg:flex md:flex sm:hidden max-sm:hidden"
        >
          {Icons.ChevrondownIcon}
        </button> */}
        <img
          src={images[selectedImageIndex]}
          className="w-[400px] h-[400px] object-cover rounded-lg"
        />
        {/* <button
          onClick={handleNextImage}
          className="p-2 rounded-full z-10 rotate-90 xl:flex lg:flex md:flex sm:hidden max-sm:hidden"
        >
          {Icons.ChevrondownIcon}
        </button> */}
      </div>
      <div className="flex overflow-x-auto w-full justify-center items-center">
        {images.map((img: any, idx: any) => (
          <img
            key={idx}
            src={img}
            alt={`Product Thumbnail ${idx + 1}`}
            onClick={() => setSelectedImageIndex(idx)}
            className={`h-16 w-16 object-cover rounded-2xl cursor-pointer shadow-md mx-2 ${
              selectedImageIndex === idx ? "border-2 border-blue-500" : ""
            }`}
          />
        ))}
      </div>
    </div>
  );
}
