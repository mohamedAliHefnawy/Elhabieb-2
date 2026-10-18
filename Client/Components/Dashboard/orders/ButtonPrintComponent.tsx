//react
import React, { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import Icons from "@/iconsSvg";
import { Cairo } from "next/font/google";

//NEXT UI
import { Avatar } from "@nextui-org/react";

//IMAGES
import faceBook from "@/public/images/facebook.png";
import linkenIn from "@/public/images/linkedin.png";
import telegram from "@/public/images/telegram.png";
import instagram from "@/public/images/instagram.png";
import whatsapp from "@/public/images/whatsapp.png";
import Hbaieb from "@/public/images/hbaieb.png";
import QRCode from "qrcode.react";

const cairo = Cairo({ subsets: ["arabic"] });

export default function BottomPrint({
  idOrder,
  client,
  address,
  phone1,
  phone2,
  date,
  priceDelivery,
  company,
  products,
}: {
  idOrder: string;
  client: string;
  address: string;
  phone1: string;
  phone2: string;
  date: string;
  priceDelivery: number;
  company: {
    name: string;
    image: string;
    phone: string;
    color: string;
  };
  products: {
    idProduct: string;
    nameProduct: string;
    colorProduct: string;
    sizeProduct: string;
    priceProduct: number;
    imageProduct: string;
    storeProduct: string;
    cityProduct: string;
    amountProduct: number;
  }[];
}) {
  const printRef = useRef<HTMLFormElement | null>(null);
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  const [offset, setOffset] = useState(0);
  const [isScrollingDown, setIsScrollingDown] = useState(true);
  let lastScrollTop = 0;

  const handleScroll = () => {
    const currentScrollTop = window.scrollY;
    if (currentScrollTop > lastScrollTop) {
      setIsScrollingDown(true);
    } else {
      setIsScrollingDown(false);
    }
    lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop;
    setOffset(currentScrollTop);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <div
        className={`fixed bottom-[50%] right-[30%] transition-transform duration-200 ${
          isScrollingDown ? "translate-y-0" : "translate-y-[-30px]"
        }`}
        style={{ transform: `translateY(${offset}px)` }}
        onClick={handlePrint}
      >
        <p
          className="hover:cursor-pointer hover:opacity-75 h-16 w-16  flex justify-center border-1 items-center p-3 mt-1 rounded-full"
          style={{
            backgroundColor: company.color || "var(--color-body)",
            borderColor: company.color || "var(--color-navbar)",
          }}
        >
          {Icons.PrinterIcon}
        </p>
      </div>

      <div className="hidden">
        <form ref={printRef} className={cairo.className}>
          <div
            className="w-[100%] border-b-0 border-1"
            style={{ borderColor: company.color || "var(--color-navbar)" }}
          >
            <div className="p-4 w-[100%] flex justify-between items-center">
              <p
                className="w-[5%] h-4"
                style={{
                  backgroundColor: company.color || "var(--color-navbar)",
                }}
              ></p>
              <p className="w-[45%] flex justify-center items-center">
                {company.image ? (
                  <Avatar src={company.image} size="md" />
                ) : (
                  <Avatar src={`${Hbaieb.src}`} size="md" />
                )}
                <span className="ml-3">{company.name || "الحبايب"}</span>
              </p>
              <p
                className="w-[50%] h-10 text-lg text-white font-bold flex justify-center items-center"
                style={{
                  backgroundColor: company.color || "var(--color-navbar)",
                }}
              >
                فاتورة
              </p>
            </div>
            <div className="">
              <div className="w-[100%] p-4 text-sm flex justify-between items-start">
                <div className="w-[40%]">
                  <QRCode value={`${idOrder}`} size={60} />
                </div>

                <div className="flex justify-between items-center w-[100%]">
                  <div className="flex flex-col items-end text-md w-[100%]">
                    <div className="flex justify-between mb-2 w-full">
                      <p className="flex">
                        <span className="mr-1">{address}</span>
                        <span className="text-black opacity-50">
                          {" "}
                          : العنوان{" "}
                        </span>
                      </p>
                      <p className="flex">
                        <span className="mr-1">{client}</span>
                        <span className="text-black opacity-50"> : الإسم </span>
                      </p>
                    </div>
                    <div className="flex justify-between mb-2 w-full">
                      <p className="flex mb-2">
                        <span className="mr-1" dir="rtl">
                          {products.reduce(
                            (calc, alt) =>
                              calc + alt.amountProduct * alt.priceProduct,
                            0
                          )}{" "}
                          د.ل
                        </span>
                        <span className="text-black opacity-50">
                          : إجمالي المنتجات
                        </span>
                      </p>
                      <p className="flex mb-2">
                        <span className="mr-1" dir="rtl">
                          {priceDelivery} د.ل
                        </span>
                        <span className="text-black opacity-50">
                          : سعر التوصيل
                        </span>
                      </p>
                    </div>
                    <p className="flex mb-2">
                      <span className="mr-1">
                        {phone1} . {phone2}
                      </span>
                      <span className="text-black opacity-50">
                        : أرقام الهواتف
                      </span>
                    </p>
                  </div>
                </div>
              </div>
              <div
                className="flex justify-evenly items-center text-sm text-black opacity-50 p-4"
                style={{
                  backgroundColor: company.color || "var(--color-navbar)",
                }}
              >
                <p className="w-[20%] text-center">المخزن</p>
                <p className="w-[20%] text-center">الإجمالي</p>
                <p className="w-[20%] text-center">الكميه</p>
                <p className="w-[20%] text-center">السعر</p>
                <p className="w-[20%] text-center">المقاس</p>
                <p className="w-[20%] text-center">اللون</p>
                <p className="w-[20%] text-center">المنتج</p>
              </div>

              {products.map((product, i) => (
                <div
                  key={i}
                  className="flex justify-evenly items-center text-sm p-4 border-b-1"
                  // style={{ borderBottom: `1px var(--Border) solid` }}
                >
                  <p className="w-[20%] text-center">{product.storeProduct}</p>
                  <p className="w-[20%] text-center">
                    {product.priceProduct * product.amountProduct}
                  </p>
                  <p className="w-[20%] text-center">{product.amountProduct}</p>
                  <p className="w-[20%] text-center">{product.priceProduct}</p>
                  <p className="w-[20%] text-center">{product.sizeProduct}</p>
                  <p
                    className="w-[20%] h-4  text-center"
                    style={{ backgroundColor: product.colorProduct }}
                  ></p>
                  <p className="w-[20%] text-center">{product.nameProduct}</p>
                </div>
              ))}

              <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <Avatar
                  src={`${Hbaieb.src}`}
                  className="w-60 h-60 opacity-30"
                />
              </div>

              <div
                className="w-[100%] p-4 flex justify-evenly items-center text-sm absolute bottom-0 left-0 right-0"
                style={{
                  backgroundColor: company.color || "var(--color-navbar)",
                }}
              >
                <div className="flex">
                  <Avatar src={faceBook.src} size="sm" className="mr-2" />
                  <Avatar src={telegram.src} size="sm" className="mr-2" />
                  <Avatar src={linkenIn.src} size="sm" className="mr-2" />
                  <Avatar src={instagram.src} size="sm" className="mr-2" />
                  <Avatar src={whatsapp.src} size="sm" className="mr-2" />
                </div>
                <div>{company.phone || <>لا يوجد رقم هاتف</>}</div>
                <div>
                  {company.image ? (
                    <Avatar src={company.image} size="md" />
                  ) : (
                    <Avatar src={`${Hbaieb.src}`} size="md" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </form>

        <style jsx global>{`
          @media print {
            body {
              font-size: 30px;
              padding: 15px;
            }

            .non-printable {
              display: none;
            }

            form {
              width: 100%;
            }

            /* Add any additional print styles here */
          }
        `}</style>
      </div>
    </>
  );
}
