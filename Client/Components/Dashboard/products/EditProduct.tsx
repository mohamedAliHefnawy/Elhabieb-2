import { useEffect, useRef, useState } from "react";
import Colors from "./AddProduct/ColorsProduct";
import Size from "./AddProduct/SizeProduct";
import Images from "./AddProduct/ImagesProduct";
import Prices from "./AddProduct/PricesProduct";
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
import CryptoJS from "crypto-js";
import axios from "axios";
import Alert from "@/Components/Alert";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductById } from "@/features/productSlice";
import { RootState, AppDispatch } from "@/src/store";
import { fetchCategories } from "@/features/categorySlice";
import React from "react";

interface TypeData {
  _id: string;
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
  sizes: {
    size: string;
    colors: string[];
    stock: {
      city: string;
      store: string;
      amount: number;
    }[];
  }[];
  products: {
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
    sizes: {
      size: string;
      colors: string[];
      stock: {
        city: string;
        store: string;
        amount: number;
      }[];
    }[];
  }[];
  properties: string[];
  branshesProductsts: string[];
}

export default function EditProduct() {
  const keyHash = process.env.NEXT_PUBLIC_KEY_HASH;
  const apiEndpoint = process.env.NEXT_PUBLIC_LINK_API;
  const { slug } = useParams() || "";
  const isInitialLoad = useRef(true);

  const dispatch = useDispatch<AppDispatch>();
  const { product } = useSelector((state: RootState) => state.product);
  const [catogry, setCatogry] = useState("");
  const { categories, loading } = useSelector(
    (state: RootState) => state.category
  );
  const [selectedVariant, setSelectedVariant] = useState("نعم");
  const [loading2, setLoading2] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [branshesProducts, setBranshesProducts] = useState<TypeData[]>([]);

  const [formData, setFormData] = useState<TypeData>({
    _id: "",
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

  const DataSendedReady: ProductSubmissionData = {
    name: formData.name,
    price: formData.price,
    priceMarkter: formData.priceMarkter,
    gainMarkter: formData.gainMarkter,
    priceCustomer: formData.priceCustomer,
    colors: formData.colors,
    images: formData.images,
    discrubtion: formData.discrubtion,
    active: formData.active,
    catogry: catogry,
    dateAdded: new Date().toLocaleDateString(),
    timeAdded: new Date().toLocaleTimeString(),
    numberSelles: 0,
    sizes: formData?.properties?.map((item) => ({
      size: item,
      colors: formData.colors,
      stock: [
        {
          city: "City1",
          store: "Store1",
          amount: 10,
        },
        {
          city: "City2",
          store: "Store2",
          amount: 5,
        },
      ],
    })),
    products: branshesProducts?.map((item) => ({
      name: item.name,
      price: item.price,
      priceMarkter: item.priceMarkter,
      gainMarkter: item.gainMarkter,
      priceCustomer: item.priceCustomer,
      colors: item.colors,
      images: item.images,
      discrubtion: item.discrubtion,
      active: true,
      catogry: catogry,
      dateAdded: new Date().toLocaleDateString(),
      timeAdded: new Date().toLocaleTimeString(),
      numberSelles: 0,
      sizes: item?.properties?.map((i) => ({
        size: i,
        colors: item.colors,
        stock: [
          {
            city: "City1",
            store: "Store1",
            amount: 10,
          },
          {
            city: "City2",
            store: "Store2",
            amount: 5,
          },
        ],
      })),
    })),
    properties: formData.properties,
    branshesProductsts: [],
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index?: number
  ) => {
    const { name, value, type } = e.target;
    if (index !== undefined) {
      setBranshesProducts((prev) =>
        prev.map((product, i) =>
          i === index
            ? {
                ...product,
                [name]: type === "number" ? parseFloat(value) || 0 : value,
              }
            : product
        )
      );
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "number" ? parseFloat(value) || 0 : value,
      }));
    }
  };

  const handleImagesChange = (updatedImages: string[], index?: number) => {
    if (typeof index === "number") {
      setBranshesProducts((prev) => {
        return prev.map((product, i) => {
          if (i === index) {
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
          i === index ? { ...product, properties: updatedProperties } : product
        )
      );
    } else {
      setFormData((prev) => ({
        ...prev,
        properties: updatedProperties,
      }));
    }
  };

  const handleDeleteSubProduct = (index: number) => {
    setBranshesProducts((prev) => prev.filter((_, i) => i !== index));
  };

  const addProductForm = () => {
    setBranshesProducts((prev) => [
      ...prev,
      {
        _id: "",
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
        active: selectedVariant === "نعم" ? true : false,
      },
    ]);
  };

  const encryptData = (data: ProductSubmissionData) => {
    if (!keyHash) {
      throw new Error("Encryption key is missing");
    }
    return CryptoJS.AES.encrypt(JSON.stringify(data), keyHash).toString();
  };

  const handleSubmit = async () => {
    if (formData.name === "") {
      Alert("error", "من فضلك أكتب إسم المنتج");
      new Audio("/mp3/pleaseEnterProductName.mp3").play();
      return;
    }
    setIsSubmitting(true);
    setLoading2(true);

    try {
      const encryptedFormData = encryptData(DataSendedReady);

      const response = await axios.post(
        `${apiEndpoint}products/editProduct/${slug}`,
        { data: encryptedFormData }
      );

      if (response.data === "EDIT_SUCCESS") {
        Alert("success", "تم تعديل المنتج بنجاح");
        new Audio("/mp3/susessEditedProduct.mp3").play();
      } else if (response.data === "Product_NAME_EXISTS") {
        Alert("error", "عذراَ هذا الإسم مستخدم من قبل");
        new Audio("/mp3/sorry.mp3").play();
      }
    } catch (error) {
      console.log(error);
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
            disabled
          />

          {!index && (
            <>
              <Autocomplete
                className="w-[100%] mt-5"
                variant="underlined"
                color="default"
                placeholder="القسم"
                isDisabled
                selectedKey={catogry}
                // defaultSelectedKey={catogry}
                // value={catogry}
                // onSelectionChange={(key) =>
                //   key !== null && setCatogry(key.toString())
                // }
                // disabled
              >
                {categories.map((item: any) => (
                  <AutocompleteItem key={item.name} value={item.name}>
                    {item.name}
                  </AutocompleteItem>
                ))}
              </Autocomplete>
              <label htmlFor="position" className="text-gray-700 mb-2 mt-7">
                هل تحب أن هذا المنتج يظهر الأن ؟
              </label>
              <RadioGroup
                orientation="horizontal"
                color="default"
                value={formData.active ? "نعم" : "لا"}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    active: value === "نعم",
                  }))
                }
                size="lg"
                className="mt-1"
              >
                <Radio value="نعم" className="capitalize">
                  نعم
                </Radio>
                <Radio value="لا" className="capitalize mx-5">
                  لا
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
          productId={productData._id as string}
          slug={slug as ""}
        />

        <Colors
          productData={productData.colors}
          onChange={(updatedColors) =>
            index !== undefined
              ? setBranshesProducts((prev) =>
                  prev.map((product, i) =>
                    i === index
                      ? { ...product, colors: updatedColors }
                      : product
                  )
                )
              : setFormData((prev) => ({ ...prev, colors: updatedColors }))
          }
          productId={productData._id as string}
          slug={slug as ""}
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
    if (isInitialLoad.current && typeof slug === "string") {
      dispatch(fetchProductById(slug));
      isInitialLoad.current = false;
    }
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    if (product) {
      const sizeSet = new Set<string>();
      const sizesAll: string[] = [];

      product.details?.forEach((detail) => {
        detail.sizes.forEach((sizeObj) => {
          if (!sizeSet.has(sizeObj.size)) {
            sizeSet.add(sizeObj.size);
            sizesAll.push(sizeObj.size);
          }
        });
      });

      setFormData({
        _id: product._id,
        name: product.name,
        price: product.price,
        priceMarkter: product.priceMarkter,
        gainMarkter: product.gainMarkter,
        priceCustomer: product.priceCustomer,
        properties: sizesAll,
        colors: product.colors,
        images: product.images,
        discrubtion: product.discrubtion,
        active: product.active,
        catogry: product.catogry,
      });

      const mappedProducts = product.products.map((branch) => {
        const branchSizeSet = new Set<string>();
        const branchSizesAll: string[] = [];

        branch.details?.forEach((detail) => {
          detail.sizes.forEach((sizeObj) => {
            if (!branchSizeSet.has(sizeObj.size)) {
              branchSizeSet.add(sizeObj.size);
              branchSizesAll.push(sizeObj.size);
            }
          });
        });

        return {
          _id: branch._id,
          name: branch.name,
          price: branch.price,
          priceMarkter: branch.priceMarkter,
          gainMarkter: branch.gainMarkter,
          priceCustomer: branch.priceCustomer,
          properties: branchSizesAll,
          colors: branch.colors,
          images: branch.images,
          discrubtion: branch.discrubtion,
          active: branch.active,
          catogry: branch.catogry,
        };
      });

      setBranshesProducts(mappedProducts || []);
    }
  }, [product]);

  return (
    <div
      className="h-screen w-full bg-[var(--color-body)] border-1 border-[var(--color-navbar)] overflow-y-auto custom-scrollbar p-6 mt-1"
      dir="rtl"
    >
      <div className="flex justify-between ">
        <h2 className="text-2xl mb-6 text-gray-800">
          تعديل <span className="text-default-400">{formData?.name}</span>{" "}
          الموجود في القسم{" "}
          <span className="text-default-400">{formData?.catogry}</span>
        </h2>
        <Button variant="bordered" color="default" onClick={addProductForm}>
          إضافة نموذج منتج جديد
        </Button>
      </div>

      <Tabs
        className="mt-2"
        aria-label="Options"
        color="default"
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
                {/* <Button
                  isIconOnly
                  variant="light"
                  className="!rounded-full"
                  onClick={() => handleDeleteSubProduct(index)}
                >
                  🗑️
                </Button> */}
              </div>
            }
          >
            {FormProduct(product, index)}
          </Tab>
        ))}
      </Tabs>

      <div className="mt-6 flex justify-end">
        <Button
          className="w-[100%] h-14 bg-[var(--color-navbar)] border-1"
          onClick={handleSubmit}
          isDisabled={isSubmitting}
          isLoading={isSubmitting}
        >
          تعديل المنتج
        </Button>
      </div>
    </div>
  );
}
