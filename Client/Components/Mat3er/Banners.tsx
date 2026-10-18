"use client";

// REACT
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";

// COMPONENTS & STORE
import Icons from "@/iconsSvg";
import { AppDispatch, RootState } from "@/src/store";
import { fetchSettings } from "@/features/settingsSlice";

const Banners = () => {
  const isInitialLoad = useRef(true);
  const dispatch = useDispatch<AppDispatch>();
  const { settings } = useSelector((state: RootState) => state.settings);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [images, setImages] = useState<string[]>([]);

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  useEffect(() => {
    if (isInitialLoad.current) {
      dispatch(fetchSettings());
      isInitialLoad.current = false;
    }
  }, [dispatch]);

  useEffect(() => {
    if (settings) {
      setImages(settings.mat3ger.images);
    }
  }, [settings]);

  return (
    <>
      <div className="relative xl:mb-0 lg:mb-0 md:mb-0 sm:mb-24 max-sm:mb-24 ">
        <div className="w-full flex justify-center">
          <div className="relative w-[90%] xl:w-[90%] lg:w-[90%] md:w-[90%] sm:w-[100%] max-sm:w-[100%] xl:h-[450px] lg:h-[450px] md:h-[200px] sm:h-[100px] max-sm:h-[100px]">
            {images.map((img, index) => (
              <div key={index} className="relative">
                <Image
                  src={img}
                  alt={`Slide ${index + 1}`}
                  className={`absolute z-40 transition-opacity duration-500 xl:h-[450px] lg:h-[450px] md:h-[200px] sm:h-[210px] max-sm:h-[210px] w-full object-cover rounded-[15px] shadow-md border border-blue-200 ${
                    index === currentImageIndex
                      ? "opacity-100 z-10"
                      : "opacity-0 z-0"
                  }`}
                  width={1920}
                  height={1080}
                />
              </div>
            ))}
          </div>
        </div>

        <button
          className="absolute z-50 xl:top-1/2 lg:top-1/2 md:top-1/2 sm:top-1/5 max-sm:top-1/5 left-4 transform -translate-y-1/2 bg-white bg-opacity-50 p-2 rotate-90 rounded-full"
          onClick={prevImage}
        >
          {Icons.ChevrondownIcon}
        </button>
        <button
          className="absolute z-50 xl:top-1/2 lg:top-1/2 md:top-1/2 sm:top-1/5 max-sm:top-1/5 right-4 transform -translate-y-1/2 bg-white bg-opacity-50 p-2 -rotate-90 rounded-full"
          onClick={nextImage}
        >
          {Icons.ChevrondownIcon}
        </button>
      </div>

      <div className="flex justify-center w-full mt-[20px]">
        <div className="relative gap-x-[20px] w-[90%] xl:flex lg:flex md:flex sm:hidden max-sm:hidden justify-center mt-[2px] space-x-[2px]">
          {images.slice(0, 2).map((img, index) => (
            <div key={index} className="relative w-full">
              <Image
                className="w-full h-40 border border-blue-200 shadow-md object-cover rounded-[15px]"
                src={img}
                alt={""}
                width={1920}
                height={1080}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Banners;
