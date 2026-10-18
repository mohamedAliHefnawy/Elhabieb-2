"use client";

//COMPONENTS
import NavBar from "@/Components/Dashboard/NavBar";
import SideBar from "@/Components/Dashboard/SideBar";
import SizeScreen from "@/Components/Dashboard/SizeScreen";
import { Spinner, Tabs, Tab, Avatar } from "@nextui-org/react";
import { useEffect, useRef, useState } from "react";
import { AppDispatch, RootState } from "@/src/store";
import { useDispatch, useSelector } from "react-redux";
import Alert from "@/Components/Alert";
import { CircleDollarSign, Newspaper, PackageOpen } from "lucide-react";
import { fetDeliveryAllData } from "@/features/delivery";
import Link from "next/link";
import ModelReturnProductToStore from "@/Components/Dashboard/deliverySecurity/modelReturnProductToStore";

interface Products {
  idProduct: string;
  nameProduct: string;
  colorProduct: string;
  sizeProduct: string;
  priceProduct: number;
  gainMarkter: number;
  priceMarkter: number;
  priceCustomer: number;
  imageProduct: string;
  storeProduct: string;
  cityProduct: string;
  amountProduct: number;
  amountNewProduct: number;
  validity: string;
}

export default function Delivery({ params }: { params: { slug: string } }) {
  const dispatch = useDispatch<AppDispatch>();
  const isInitialLoad = useRef(true);

  const { allData, loading, error } = useSelector(
    (state: RootState) => state.delivery
  );

  if (error) {
    Alert("error", "توجد مشكلة في الإنترنت حاول تنشيط الصفحة");
    new Audio("/mp3/proplemInternet.mp3").play();
    return;
  }

  const [selectedProducts, setSelectedProducts] = useState<Products[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchTerm2, setSearchTerm2] = useState("");

  const groupedProducts =
    allData &&
    allData.productsReturnedAndPartial &&
    allData?.productsReturnedAndPartial.reduce((acc: any, product: any) => {
      const {
        idProduct,
        sizeProduct,
        colorProduct,
        amountNewProduct,
        amountProduct,
      } = product;
      const key = `${idProduct}-${sizeProduct}-${colorProduct}`;

      if (acc[key]) {
        acc[key].amountNewProduct += amountNewProduct;
        acc[key].amountProduct += amountProduct;
      } else {
        acc[key] = { ...product };
      }

      return acc;
    }, {});

  const uniqueProducts = groupedProducts
    ? (Object.values(groupedProducts) as Products[])
    : [];

  const filteredProducts = uniqueProducts.filter(
    (product) =>
      product.nameProduct.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.colorProduct.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.idProduct.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.storeProduct.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sizeProduct.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredProducts2 = allData?.productsWithOrderWaiting.filter(
    (product) =>
      product.nameProduct.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.colorProduct.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.idProduct.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.storeProduct.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sizeProduct.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const SelectedProduct = (id: string, color: string, size: string) => {
    const findProduct = uniqueProducts.find(
      (item) =>
        item.idProduct === id &&
        item.colorProduct === color &&
        item.sizeProduct === size
    );

    if (!findProduct) return;

    if (
      selectedProducts.some(
        (selected) =>
          selected.idProduct === id &&
          selected.colorProduct === color &&
          selected.sizeProduct === size
      )
    ) {
      setSelectedProducts((prev) =>
        prev.filter(
          (item) =>
            item.idProduct !== id &&
            item.colorProduct !== color &&
            item.sizeProduct !== size
        )
      );
    } else {
      setSelectedProducts((prev) => [
        ...prev,
        {
          amountNewProduct: findProduct.amountNewProduct,
          amountProduct: findProduct.amountProduct,
          cityProduct: findProduct.cityProduct,
          colorProduct: findProduct.colorProduct,
          gainMarkter: findProduct.gainMarkter,
          idProduct: findProduct.idProduct,
          imageProduct: findProduct.imageProduct,
          nameProduct: findProduct.nameProduct,
          priceCustomer: findProduct.priceCustomer,
          priceMarkter: findProduct.priceMarkter,
          priceProduct: findProduct.priceProduct,
          sizeProduct: findProduct.sizeProduct,
          storeProduct: findProduct.storeProduct,
          validity: findProduct.validity,
        },
      ]);
    }
  };

  const DivMoneyDelivery = () => {
    return (
      <div>
        <div>
          <div
            dir="rtl"
            className="flex items-center mt-4 mb-5 p-4 pr-10 pl-10 bg-primar shadow-lg shadow-[var(--color-navbar)] border-1 rounded-2xl text-black opacity-75"
          >
            <div className="w-[100%] text-center text-black opacity-50">
              <p> المبلغ </p>
            </div>
            <div className="w-[100%] text-center text-black opacity-50">
              <p> الحالة </p>
            </div>

            <div className="w-[100%] text-center text-black opacity-50">
              <p> التاريخ </p>
            </div>
            <div className="w-[100%] text-center text-black opacity-50">
              <p> الوقت </p>
            </div>
            <div className="w-[100%] text-center text-black opacity-50">
              <p> ملاحظة </p>
            </div>
          </div>

          <div className="mb-14">
            {loading ? (
              <div className="flex justify-center items-center h-[400px]">
                <Spinner size="lg" color="success" />
              </div>
            ) : allData && allData.money && allData?.money.length > 0 ? (
              allData?.money
                .slice()
                .reverse()
                .map((item, i) => (
                  <div
                    key={i}
                    dir="rtl"
                    className="flex items-center mb-3 p-4 pr-10 pl-10 bg-[var(--color-body)] shadow rounded-2xl border-1 border-[var(--color-navbar)]"
                  >
                    <div className="w-[100%] text-center">
                      <p>
                        <span>{item.money}</span>
                        <span className="mr-1">د.ل</span>
                      </p>
                    </div>
                    <div className="w-[100%] text-center">
                      {item.status === "أموال فاشلة" && (
                        <p className="text-red-600">أموال فاشلة</p>
                      )}
                      {item.status === "أموال قابلة للتحويل" && (
                        <p className="text-green-600">أموال قابلة للتحويل</p>
                      )}
                      {item.status === "أموال متوقعة" && (
                        <p className="text-yellow-600">أموال متوقعة</p>
                      )}
                      {item.status === "في إنتظار قبول الأدمن" && (
                        <p className="text-yellow-600">في إنتظار قبول الأدمن</p>
                      )}
                      {item.status === "تم الإستلام بنجاح" && (
                        <p className="text-green-600">تم الإستلام بنجاح</p>
                      )}
                    </div>
                    <div className="w-[100%] text-center">
                      <p> {item.date} </p>
                    </div>
                    <div className="w-[100%] text-center">
                      <p> {item.time}</p>
                    </div>
                    <div className="w-[100%] text-center">
                      <Link
                        href={`/dashboard/orders/${item.orderId}`}
                        className="text-orange-400 underline"
                      >
                        {item.orderId}
                      </Link>
                    </div>
                  </div>
                ))
            ) : (
              <div className="flex justify-center items-center h-[400px] text-black opacity-50">
                لا توجد أموال في حسابه .
              </div>
            )}
          </div>
          <div
            dir="rtl"
            className="fixed z-50 bottom-0 right-[20%] flex items-center mb-3 p-4 pr-10 pl-10 bg-[var(--color-body)] shadow-lg rounded-2xl border-1 border-[var(--color-navbar)]"
          >
            <p>إجمالي المبلغ </p>
            <p
              className={`mr-2 ${
                allData &&
                allData.money &&
                allData.money.length > 0 &&
                allData.money.reduce((calc, i) => calc + i.money, 0) > 0
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              <span>
                {allData &&
                  allData.money &&
                  allData.money.reduce((calc, i) => calc + i.money, 0)}
              </span>
              <span className="mr-1">د.ل</span>
            </p>
          </div>
        </div>
      </div>
    );
  };

  const DivProducts1 = () => {
    return (
      <div className="w-full">
        {loading ? (
          <div className="flex justify-center items-center h-[400px]">
            <Spinner size="lg" color="success" />
          </div>
        ) : (
          <>
            <input
              type="text"
              className="input mb-3"
              placeholder="... بحث"
              value={searchTerm2}
              onChange={(e) => setSearchTerm2(e.target.value)}
            />
            <div className="grid grid-cols-4 gap-1">
              {filteredProducts2 &&
                filteredProducts2.map((item, i) => (
                  <div
                    className={`border border-gray-200  p-4 rounded-lg flex items-center justify-between cursor-pointer`}
                    dir="rtl"
                    key={i}
                  >
                    <div>
                      <p>
                        <span className="opacity-70 ml-1">إسم المنتج :</span>
                        <span>{item.nameProduct}</span>
                      </p>
                      <div className="flex items-center my-3">
                        <div className="flex items-center">
                          <p className="opacity-70 ml-1">اللون :</p>
                          <p
                            className="w-5 h-5 rounded-full"
                            style={{ backgroundColor: item.colorProduct }}
                          ></p>
                        </div>
                        <p className="mr-2">|</p>
                        <p className="mr-2">
                          <span className="opacity-70 ml-1">الحجم :</span>
                          <span>{item.sizeProduct}</span>
                        </p>
                      </div>
                      <div className="flex items-center">
                        <p>
                          <span className="opacity-70 ml-1">السعر :</span>
                          <span>
                            {item.validity === "Markter"
                              ? item.priceMarkter
                              : item.priceCustomer}
                            <span className="mr-1">د.ل</span>
                          </span>
                        </p>
                        <p className="mr-3">|</p>
                        <p className="mr-4">
                          <span className="opacity-70 ml-1">الكمية :</span>
                          <span>{item.amountProduct}</span>
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-start gap-y-2 text-gray-500">
                      <Avatar
                        src={item.imageProduct}
                        className={`border-1 w-20 h-20 border-green-800 outline-2 outline-white relative -ml-2`}
                      />
                    </div>
                  </div>
                ))}
            </div>

            <div>
              {filteredProducts2?.length === 0 && (
                <p className="opacity-60 text-center mt-28">لا توجد منتجات</p>
              )}
            </div>
          </>
        )}
      </div>
    );
  };

  const DivProducts2 = () => {
    return (
      <div className="w-full">
        {loading ? (
          <div className="flex justify-center items-center h-[400px]">
            <Spinner size="lg" color="success" />
          </div>
        ) : (
          <>
            <input
              type="text"
              className="input mb-3"
              placeholder="... بحث"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="grid grid-cols-4 gap-1">
              {filteredProducts.map((item, i) => (
                <div
                  className={`border border-gray-200 ${
                    selectedProducts.some(
                      (selected) =>
                        selected.idProduct === item.idProduct &&
                        selected.colorProduct === item.colorProduct &&
                        selected.sizeProduct === item.sizeProduct
                    )
                      ? "border-gray-500"
                      : ""
                  } p-4 rounded-lg flex items-center justify-between cursor-pointer`}
                  dir="rtl"
                  key={i}
                  onClick={() =>
                    SelectedProduct(
                      item.idProduct,
                      item.colorProduct,
                      item.sizeProduct
                    )
                  }
                >
                  <div>
                    <p>
                      <span className="opacity-70 ml-1">إسم المنتج :</span>
                      <span>{item.nameProduct}</span>
                    </p>
                    <div className="flex items-center my-3">
                      <div className="flex items-center">
                        <p className="opacity-70 ml-1">اللون :</p>
                        <p
                          className="w-5 h-5 rounded-full"
                          style={{ backgroundColor: item.colorProduct }}
                        ></p>
                      </div>
                      <p className="mr-2">|</p>
                      <p className="mr-2">
                        <span className="opacity-70 ml-1">الحجم :</span>
                        <span>{item.sizeProduct}</span>
                      </p>
                    </div>
                    <div className="flex items-center">
                      <p>
                        <span className="opacity-70 ml-1">السعر :</span>
                        <span>
                          {item.validity === "Markter"
                            ? item.priceMarkter
                            : item.priceCustomer}
                          <span className="mr-1">د.ل</span>
                        </span>
                      </p>
                      <p className="mr-3">|</p>
                      <p className="mr-4">
                        <span className="opacity-70 ml-1">الكمية :</span>
                        <span>{item.amountNewProduct}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-start gap-y-2 text-gray-500">
                    <Avatar
                      src={item.imageProduct}
                      className={`border-1 w-20 h-20 border-green-800 outline-2 outline-white relative -ml-2`}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div>
              {filteredProducts.length === 0 && (
                <p className="opacity-60 text-center mt-28">
                  لا يوجد منتجات مطابقة
                </p>
              )}
            </div>
          </>
        )}
      </div>
    );
  };

  const Body = () => {
    return (
      <div className="h-screen w-[100%] bg-[var(--color-body)] border-1 border-[var(--color-navbar)]  overflow-y-auto custom-scrollbar p-6 mt-1">
        <div className="flex w-full flex-col">
          <Tabs variant="underlined" dir="rtl" className="mt-6">
            <Tab
              key="الأموال"
              className="p-9"
              title={
                <div className="flex flex-col items-center">
                  <p className="mb-1">
                    <CircleDollarSign strokeWidth={1.25} />
                  </p>
                  <p>الأموال</p>
                </div>
              }
            >
              {DivMoneyDelivery()}
            </Tab>
            <Tab
              key="طلبيات في الإنتظار"
              className="p-9"
              title={
                <div className="flex flex-col items-center">
                  <p className="mb-1">
                    <Newspaper strokeWidth={1.25} absoluteStrokeWidth />
                  </p>
                  <p>طلبيات في الإنتظار</p>
                </div>
              }
            >
              {DivProducts1()}
            </Tab>
            <Tab
              key="منتجات في المخزن"
              className="p-9"
              title={
                <div className="flex flex-col items-center">
                  <p className="mb-1">
                    <PackageOpen strokeWidth={1.25} absoluteStrokeWidth />
                  </p>
                  <p>منتجات في المخزن</p>
                </div>
              }
            >
              {DivProducts2()}
              <ModelReturnProductToStore
                products={selectedProducts}
                idDelivery={params.slug}
              />
            </Tab>
          </Tabs>
        </div>
      </div>
    );
  };

  useEffect(() => {
    if (isInitialLoad.current) {
      dispatch(fetDeliveryAllData(params.slug));

      isInitialLoad.current = false;
    }
  }, [dispatch, params.slug]);

  return (
    <>
      <div className="w-full h-screen flex max-2xl:flex max-xl:flex lg:flex md:hidden sm:hidden max-sm:hidden">
        <div className="w-[84%] mr-1 flex flex-col">
          <NavBar />
          {loading ? (
            <div className="h-screen mt-1 w-[100%] bg-[var(--color-body)] border-1 border-[var(--color-navbar)] flex items-center justify-center">
              <Spinner color="success" size="lg" />
            </div>
          ) : (
            <>{Body()}</>
          )}
        </div>
        <div className="w-[16%] bg-white flex flex-col">
          <SideBar />
        </div>
      </div>

      <SizeScreen />
    </>
  );
}
