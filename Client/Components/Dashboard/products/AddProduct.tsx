import { ChangeEvent, useEffect, useState } from "react";
import Colors from "./AddProduct/ColorsProduct";
import Size from "./AddProduct/SizeProduct";
import Images from "./AddProduct/ImagesProduct";
import Prices from "./AddProduct/PricesProduct";
import CryptoJS from "crypto-js";
import axios from "axios";
import Alert from "@/Components/Alert";
import { fetchCategories } from "@/features/categorySlice";
import { RootState, AppDispatch } from "@/src/store";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  Tab,
  Tabs,
  Spinner,
  Autocomplete,
  AutocompleteItem,
  RadioGroup,
  Radio,
} from "@nextui-org/react";
import React from "react";

interface TypeData {
  name: string;
  price: number;
  priceMarkter: number;
  gainMarkter: number;
  priceCustomer: number;
  properties: string[];
  colors: string[];
  images: string[];
  discrubtion: string;
  catogry: string;
  active: boolean;
}

interface ProductSubmissionData {
  name: string;
  price: number;
  priceMarkter: number;
  gainMarkter: number;
  priceCustomer: number;
  colors: string[];
  images: string[];
  discrubtion: string;
  active: boolean;
  catogry: string;
  dateAdded: string;
  timeAdded: string;
  numberSelles: number;
  properties: string[];
  sizes: {
    size: string;
    colors: string[];
    stock: {
      city: string;
      store: string;
      amount: number;
    }[];
  }[];
  products: ProductSubmissionData[];
}

export default function AddProduct() {
  const keyHash = process.env.NEXT_PUBLIC_KEY_HASH;
  const apiEndpoint = process.env.NEXT_PUBLIC_LINK_API;
  const dispatch = useDispatch<AppDispatch>();

  const [branshesProducts, setBranshesProducts] = useState<TypeData[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [loading2, setLoading2] = useState<boolean>(false);
  const [selectedVariant, setSelectedVariant] = useState("نعم");
  const [catogry, setCatogry] = useState("");
  const { categories, loading } = useSelector(
    (state: RootState) => state.category
  );
  const [formData, setFormData] = useState<TypeData>({
    name: "",
    price: 0,
    priceMarkter: 0,
    gainMarkter: 0,
    priceCustomer: 0,
    properties: [""],
    colors: ["#000000"],
    images: [],
    discrubtion: "",
    catogry: "",
    active: true,
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index?: number
  ) => {
    const { name, value, type } = e.target;
    const parsedValue = type === "number" ? parseFloat(value) || 0 : value;

    if (index !== undefined) {
      setBranshesProducts((prev) =>
        prev.map((product, i) =>
          i === index - 1 ? { ...product, [name]: parsedValue } : product
        )
      );
    } else {
      setFormData((prev) => ({ ...prev, [name]: parsedValue }));
    }
  };

  const handleImagesChange = (updatedImages: string[], index?: number) => {
    if (typeof index === "number") {
      setBranshesProducts((prev) => {
        return prev.map((product, i) => {
          if (i + 1 === index) {
            return {
              ...product,
              images: updatedImages,
            };
          }
          return product;
        });
      });
    } else {
      setFormData((prev) => {
        return {
          ...prev,
          images: updatedImages,
        };
      });
    }
  };

  const handleSizeChange = (updatedProperties: string[], index?: number) => {
    if (index !== undefined) {
      setBranshesProducts((prev) =>
        prev.map((product, i) =>
          i + 1 === index
            ? { ...product, properties: updatedProperties }
            : product
        )
      );
    } else {
      setFormData((prev) => ({ ...prev, properties: updatedProperties }));
    }
  };

  const handleDeleteSubProduct = (index: number) => {
    setBranshesProducts((prev) => prev.filter((_, i) => i !== index));
  };

  const addProductForm = () => {
    setBranshesProducts((prev) => [
      ...prev,
      {
        name: formData.name,
        price: 0,
        priceMarkter: 0,
        gainMarkter: 0,
        priceCustomer: 0,
        properties: [""],
        colors: ["#000000"],
        images: [],
        discrubtion: "",
        catogry: catogry,
        active: true,
      },
    ]);
  };

  const encryptData = (data: ProductSubmissionData) => {
    if (!keyHash) throw new Error("Encryption key is missing");
    return CryptoJS.AES.encrypt(JSON.stringify(data), keyHash).toString();
  };

  const DataSendedReady: ProductSubmissionData = {
    ...formData,
    active: selectedVariant === "نعم" ? true : false,
    dateAdded: new Date().toLocaleDateString(),
    timeAdded: new Date().toLocaleTimeString(),
    catogry: catogry,
    numberSelles: 0,
    sizes: formData.properties.map((item) => ({
      size: item,
      colors: formData.colors,
      stock: [
        { city: "City1", store: "Store1", amount: 10 },
        { city: "City2", store: "Store2", amount: 5 },
      ],
    })),
    products: branshesProducts.map((item) => ({
      ...item,
      active: selectedVariant === "نعم" ? true : false,
      dateAdded: new Date().toLocaleDateString(),
      timeAdded: new Date().toLocaleTimeString(),
      numberSelles: 0,
      catogry: catogry,
      images: item.images,
      sizes: (item.properties ?? []).map((size) => ({
        size,
        colors: item.colors,
        stock: [
          { city: "City1", store: "Store1", amount: 10 },
          { city: "City2", store: "Store2", amount: 5 },
        ],
      })),
      products: [],
    })),
  };

  const handleSubmit = async () => {
    if (catogry === "") {
      Alert("error", "من فضلك إختر القسم");
      new Audio("/mp3/pleaseChooseCatogry.mp3").play();
      return;
    } else if (formData.name === "") {
      Alert("error", "من فضلك أكتب إسم المنتج");
      new Audio("/mp3/pleaseEnterProductName.mp3").play();
      return;
    }
    setIsSubmitting(true);
    setLoading2(true);

    try {
      const encryptedFormData = encryptData(DataSendedReady);

      const response = await axios.post(`${apiEndpoint}products/addProduct`, {
        data: encryptedFormData,
      });

      if (response.data === "ADDED_SUSESS") {
        Alert("success", "تم إضافة المنتج بنجاح");
        new Audio("/mp3/susessAddedProduct.mp3").play();
        setFormData({
          name: "",
          price: 0,
          priceMarkter: 0,
          gainMarkter: 0,
          priceCustomer: 0,
          properties: [""],
          colors: ["#000000"],
          images: [],
          discrubtion: "",
          catogry: "",
          active: true,
        });
        setBranshesProducts([]);
      } else if (response.data === "EXIT_SURE") {
        Alert("error", "عذراَ هذا الإسم مستخدم من قبل");
        new Audio("/mp3/sorry.mp3").play();
      }
    } catch (error) {
      console.error("Error submitting data", error);
      Alert("error", "توجد مشكلة في الإنترنت حاول تنشيط الصفحة");
      new Audio("/mp3/proplemInternet.mp3").play();
    } finally {
      setLoading2(false);
      setIsSubmitting(false);
    }
  };

  const FormProduct = (productData: TypeData, index?: number) => (
    <form className="border-1 border-dashed border-slate-400 rounded-xl my-2">
      <div className="flex gap-2">
        <div className="flex flex-col mt-5 mr-5">
          <label
            htmlFor={`name-${index}`}
            className="text-gray-700 mb-2 mr-2 opacity-55"
          >
            إسم المنتج
          </label>
          <input
            className="input"
            type="text"
            id={`name-${index}`}
            name="name"
            value={productData.name}
            onChange={(e) => handleChange(e, index)}
            required
            disabled={index !== undefined}
          />

          {!index && (
            <>
              <Autocomplete
                className="w-[100%] mt-5"
                variant="underlined"
                color="success"
                placeholder="القسم"
                selectedKey={catogry}
                onSelectionChange={(key) =>
                  key !== null && setCatogry(key.toString())
                }
              >
                {categories.map((item: any) => (
                  <AutocompleteItem key={item.name} value={item.name}>
                    {item.name}
                  </AutocompleteItem>
                ))}
              </Autocomplete>
              <label htmlFor="position" className="text-gray-700 mb-2 mt-7">
                هل المنتج يظهر الأن ؟
              </label>
              <RadioGroup
                orientation="horizontal"
                color="default"
                defaultValue="نعم"
                onValueChange={setSelectedVariant}
                size="lg"
                className="mt-1"
              >
                <Radio value="نعم" className="capitalize">
                  <p className="text-green-600">نعم</p>
                </Radio>
                <Radio value="لا" className="capitalize mx-5">
                  <p className="text-red-600">لا</p>
                </Radio>
              </RadioGroup>
            </>
          )}
        </div>

        <Prices
          productData={productData}
          onChange={(e) => handleChange(e, index)}
        />
        <Size
          properties={productData.properties}
          onChange={(updatedProperties) =>
            handleSizeChange(updatedProperties, index)
          }
          productId={""}
          slug={""}
        />

        <Colors
          productData={productData.colors}
          onChange={(updatedColors) =>
            index !== undefined
              ? setBranshesProducts((prev) =>
                  prev.map((product, i) =>
                    i === index - 1
                      ? { ...product, colors: updatedColors }
                      : product
                  )
                )
              : setFormData((prev) => ({ ...prev, colors: updatedColors }))
          }
          productId={""}
          slug={""}
        />
      </div>
      <div className="border-dashed border-t-1 border-gray-400 p-5 flex">
        <Images
          productData={productData.images}
          onChange={(updatedImages) => handleImagesChange(updatedImages, index)}
        />
        <div className="flex flex-col w-[35%] mr-5">
          <label
            htmlFor={`discrubtion-${index}`}
            className="text-gray-700 mb-2 mr-2 opacity-55"
          >
            وصف المنتج
          </label>
          <textarea
            className="input max-h-52 min-h-32 p-5"
            id={`discrubtion-${index}`}
            name="discrubtion"
            value={productData.discrubtion}
            onChange={(e) => handleChange(e, index)}
            required
          />
        </div>
      </div>
    </form>
  );

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  return (
    <div
      className="h-screen w-full bg-[var(--color-body)] border-1 border-[var(--color-navbar)] overflow-y-auto custom-scrollbar p-6 mt-1"
      dir="rtl"
    >
      <div className="flex justify-between ">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">
          إضافة منتج جديد
        </h2>
        <Button
          onClick={addProductForm}
          className="bg-[var(--color-navbar)] border-1"
        >
          إضافة نموذج منتج جديد
        </Button>
      </div>

      <Tabs
        className="mt-2"
        aria-label="Options"
        color="success"
        variant="underlined"
      >
        <Tab
          key="المنتج الرئيسي"
          title={<p className="mb-4">المنتج الرئيسي</p>}
        >
          {FormProduct(formData)}
        </Tab>
        {branshesProducts.map((product, index) => (
          <Tab
            key={`branch-${index}`}
            title={
              <div className="flex items-center mb-4">
                <p>منتج فرعي {index + 1}</p>
                <Button
                  isIconOnly
                  variant="light"
                  className="!rounded-full"
                  onClick={() => handleDeleteSubProduct(index)}
                >
                  🗑️
                </Button>
              </div>
            }
          >
            {FormProduct(product, index + 1)}
          </Tab>
        ))}
      </Tabs>

      <div className="flex justify-center">
        <Button
          className="w-[100%] h-14 bg-[var(--color-navbar)] border-1"
          onClick={handleSubmit}
          isDisabled={isSubmitting}
          isLoading={loading2}
        >
          إضافة المنتج
        </Button>
      </div>
    </div>
  );
}
