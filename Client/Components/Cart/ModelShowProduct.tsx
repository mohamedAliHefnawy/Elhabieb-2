// REACT
import React, { useEffect, useState } from "react";

// COMPONENTS
import Icons from "@/iconsSvg";
import ProductImages from "@/Components/Mat3er/TiesPageProducts.tsx/productImages";
import ProductSizes from "@/Components/Mat3er/TiesPageProducts.tsx/productSizes";
import ProductColors from "@/Components/Mat3er/TiesPageProducts.tsx/productColors";

// NEXT UI
import { Modal, ModalContent, useDisclosure } from "@nextui-org/react";
import ButtonCart from "./ButtonCart";
import Alert from "../Alert";
import { useSession } from "next-auth/react";
import { getValidityFromLocalStorage } from "../validate";
import getSessionData, { SessionData } from "@/contexts/SessionContext";
import { Heart, ShoppingCart } from "lucide-react";
import ButtonFav from "../Fav/ButtonFav";
import useSessionData from "@/hooks/useSessionData";

export default function ModelShowProduct({
  idProduct,
  nameProduct,
  priceProduct,
  priceCustomer,
  priceMarkter,
  colorsProduct,
  imagesProduct,
  discrubtionProduct,
  catogryProduct,
  numberSellesProduct,
  detailsProduct,
  products,
}: {
  idProduct: string;
  nameProduct: string;
  priceProduct: number;
  priceCustomer: number;
  priceMarkter: number;
  colorsProduct: string[];
  imagesProduct: string[];
  discrubtionProduct: string;
  catogryProduct: string;
  numberSellesProduct: number;
  detailsProduct: [
    {
      color: string;
      sizes: [
        {
          size: string;
          city: string;
          store: string;
          amount: number;
        }
      ];
    }
  ];
  products: {
    _id: string;
    properties: string[];
    name: string;
    price: number;
    priceMarkter: number;
    priceCustomer: number;
    colors: string[];
    images: string[];
    discrubtion: string;
    active: boolean;
    catogry: string;
    dateAdded: string;
    timeAdded: string;
    numberSelles: number;
    details: [
      {
        color: string;
        sizes: [
          {
            size: string;
            city: string;
            store: string;
            amount: number;
          }
        ];
      }
    ];
  }[];
}) {
  const sessionData = useSessionData();

  const [isMobile, setIsMobile] = useState(false);

  const colorsArray = Array.isArray(colorsProduct) ? colorsProduct : [];
  const productsArray = Array.isArray(products) ? products : [];
  const imagesArray = Array.isArray(imagesProduct) ? imagesProduct : [];
  const detailsArray = Array.isArray(detailsProduct) ? detailsProduct : [];

  const AllColors = Array.from(
    new Set([
      ...colorsArray,
      ...productsArray.flatMap((product) => product.colors),
    ])
  );
  const AllImages = Array.from(
    new Set([
      ...imagesArray,
      ...productsArray.flatMap((product) => product.images),
    ])
  );

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedColor, setSelectedColor] = useState(AllColors[0]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const foundProduct = (() => {
    const isColorInColorsProduct =
      Array.isArray(colorsProduct) && colorsProduct.includes(selectedColor);
    if (isColorInColorsProduct) {
      return {
        idProduct: idProduct,
        priceProduct:
          sessionData?.validity === "Markter" ? priceMarkter : priceCustomer,
        discrubtionProduct: discrubtionProduct,
        sizesProduct: detailsArray.map((item) => item.sizes),
      };
    } else {
      const product = productsArray.find((item) =>
        item.colors.find((item2) => item2 === selectedColor)
      );

      if (product) {
        return {
          idProduct: product._id,
          priceProduct:
            sessionData?.validity === "Markter"
              ? product?.priceMarkter
              : product?.priceCustomer,
          discrubtionProduct: product.discrubtion,
          sizesProduct: product.details.map((item) => item.sizes),
        };
      } else {
        return {
          idProduct: "",
          priceProduct: 0,
          discrubtionProduct: "",
          sizesProduct: [],
        };
      }
    }
  })();

  const SizesAvalible = Array.from(
    new Set(
      foundProduct.sizesProduct?.flatMap((sizesArray: any) =>
        sizesArray.map((sizeItem: any) => sizeItem.size)
      ) || []
    )
  );

  function IsAmount() {
    let result = true;
    const amount = detailsProduct.reduce(
      (total, item) =>
        total +
        item.sizes.reduce((sizeTotal, size) => sizeTotal + size.amount, 0),
      0
    );

    if (amount === 0) {
      result = false;
    }

    return result;
  }

  const [selectedSize, setSelectedSize] = useState(
    SizesAvalible.length > 0 ? SizesAvalible[0] : ""
  );

  const showMessage = () => {
    Alert("warning", "يجب إختيار حجم أولا إذا كان متوفرا");
    new Audio("/mp3/mustChooseSize.mp3").play();
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      <p onClick={onOpen} className="text-[var(--color-matg3er)]">
        <ShoppingCart size={28} strokeWidth={1} />
      </p>
      <Modal
        hideCloseButton
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size={isMobile ? "sm" : "5xl"}
        className="p-6 max-h-[450px] overflow-y-auto scrollbar "
      >
        <ModalContent>
          {(onClose) => (
            <>
              <div>
                <div className="mx-auto">
                  <div className="xl:flex lg:flex md:flex" dir="rtl">
                    <ProductImages
                      images={AllImages}
                      selectedImageIndex={selectedImageIndex}
                      setSelectedImageIndex={setSelectedImageIndex}
                    />
                    <div className="mt-5 mr-4 xl:w-[50%] lg:w-[50%] md:w-[50%] sm:w-[100%] max-sm:w-[100%]">
                      <div className="flex items-end text-[var(--color-matg3er)]">
                        <p className="text-5xl">{foundProduct.priceProduct}</p>
                        <p className="mb-1 mr-1">د.ل</p>
                      </div>
                      <p className="text-gray-700 mb-6 mt-2">{nameProduct}</p>
                      <ProductColors
                        colors={AllColors}
                        selectedColor={selectedColor}
                        setSelectedColor={(color: string) => {
                          setSelectedColor(color);
                          setSelectedSize("");
                        }}
                      />
                      <ProductSizes
                        sizes={SizesAvalible}
                        selectedSize={selectedSize}
                        setSelectedSize={setSelectedSize}
                      />
                      <div className="mt-6 mr-3 flex gap-7">
                        <div className="hover:cursor-pointer hover:text-[var(--color-matg3er)]">
                          {SizesAvalible.length > 0 ? (
                            selectedSize !== "" ? (
                              IsAmount() ? (
                                <ButtonCart
                                  idProduct={foundProduct.idProduct as string}
                                  colorProduct={selectedColor}
                                  sizeProduct={selectedSize}
                                />
                              ) : (
                                <p
                                  onClick={() =>
                                    Alert(
                                      "warning",
                                      "هذا المنتج غير متوفر في اي مخزن"
                                    )
                                  }
                                  className="hover:text-red-600"
                                >
                                  {Icons.ShoppingcartIcon}
                                </p>
                              )
                            ) : (
                              <p
                                onClick={showMessage}
                                className="hover:text-red-600"
                              >
                                {Icons.ShoppingcartIcon}
                              </p>
                            )
                          ) : (
                            <p
                              onClick={showMessage}
                              className="hover:text-red-600"
                            >
                              {Icons.ShoppingcartIcon}
                            </p>
                          )}
                        </div>
                        <div className="hover:cursor-pointer hover:text-[var(--color-matg3er)]">
                          <ButtonFav idProduct={idProduct} />
                        </div>
                      </div>
                      <div className="mt-7 px-2">
                        <h3 className="mb-2 opacity-70">وصف المنتج </h3>
                        <p>{foundProduct.discrubtionProduct}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
