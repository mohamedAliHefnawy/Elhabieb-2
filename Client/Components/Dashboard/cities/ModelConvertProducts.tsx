import Alert from "@/Components/Alert";
import { fetchCities } from "@/features/citiesSlice";
import { AppDispatch, RootState } from "@/src/store";
import {
  Modal,
  ModalContent,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Button,
  useDisclosure,
  Avatar,
  Autocomplete,
  AutocompleteItem,
} from "@nextui-org/react";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CryptoJS from "crypto-js";
import { useRouter } from "next/navigation";

interface GroupedProduct {
  productId: string;
  color: string;
  image: string;
  sizes: {
    size: string;
    city: string;
    store: string;
    amount: number;
    _id: string;
  }[];
}

export default function ModelConvertProducts({
  products,
  idCity,
  idStore,
}: {
  products: GroupedProduct[];
  idCity: string;
  idStore: string;
}) {
  const keyHash = process.env.NEXT_PUBLIC_KEY_HASH;
  const apiEndpoint = process.env.NEXT_PUBLIC_LINK_API;
  const dispatch = useDispatch<AppDispatch>();
  const isInitialLoad = useRef(true);
  const router = useRouter();

  const { Cities = [], loading } = useSelector(
    (state: RootState) => state.city
  );

  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [selectedCity, setSlectedCity] = React.useState("");
  const [selectedStore, setSlectedStore] = React.useState("");
  const [productSelections, setProductSelections] = useState<{
    [key: string]: {
      size: string;
      color: string;
      quantity: number;
    };
  }>({});

  const handleProductSelectionChange = (
    productId: string,
    key: "size" | "color" | "quantity",
    value: string | number
  ) => {
    setProductSelections((prevSelections) => ({
      ...prevSelections,
      [productId]: {
        ...prevSelections[productId],
        [key]: value,
      },
    }));
  };

  const handleSubmit = async () => {
    if (selectedCity === "") {
      Alert("error", "من فضلك إختر المدينة");
      new Audio("/mp3/pleaseChooseCity.mp3").play();
      return;
    }
    if (selectedStore === "") {
      Alert("error", "من فضلك إختر المخزن");
      new Audio("/mp3/pleaseChooseStore.mp3").play();
      return;
    }
    if (!keyHash) {
      return;
    }

    const dataToEncrypt = {
      selectedCity,
      selectedStore,
      productSelections,
      idCity,
      idStore,
    };

    const encryptedData = CryptoJS.AES.encrypt(
      JSON.stringify(dataToEncrypt),
      keyHash
    ).toString();

    setIsSubmitting(true);

    try {
      const response = await axios.post(
        `${apiEndpoint}cities/convertProducts`,
        {
          data: encryptedData,
        }
      );

      if (response.data === "SUCCESS") {
        Alert("success", "تم التحويل بنجاح");
        // new Audio("/mp3/createPurshesSucess.mp3").play();
        router.push("/dashboard/cities/");
      }
    } catch (error) {
      console.error("Error submitting data", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (isInitialLoad.current) {
      dispatch(fetchCities());
      isInitialLoad.current = false;
    }
  }, [dispatch]);

  useEffect(() => {
    if (products && products.length > 0) {
      const defaultProductSelections: {
        [key: string]: {
          size: string;
          color: string;
          quantity: number;
        };
      } = {};

      products.forEach((product) => {
        const firstSize = product.sizes[0]?.size || "";
        const firstColor = product.color; // تأكد من وجود خاصية اللون في كائن المنتج

        if (firstSize && firstColor) {
          defaultProductSelections[product.productId] = {
            size: firstSize,
            color: firstColor, // احصل على اللون الافتراضي
            quantity: 1, // الكمية الافتراضية
          };
        }
      });

      setProductSelections(defaultProductSelections);
    }
  }, [products]);

  return (
    <>
      <Button
        onClick={onOpen}
        className="h-12 bg-[var(--color-navbar)] border-1"
      >
        نقل منتج إلى مخازن أخرى
      </Button>
      <Modal
        backdrop="blur"
        hideCloseButton
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        isDismissable={false}
        size="5xl"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>َ</ModalHeader>
              <ModalBody className="flex flex-col items-center relative">
                <div className="overflow-x-auto w-[100%]" dir="rtl">
                  <table className="min-w-full border-1 border-[var(--color-navbar)] text-center">
                    <thead>
                      <tr className="border-1 border-[var(--color-navbar)]">
                        <th className="p-4 border-1 border-[var(--color-navbar)]">
                          #id
                        </th>
                        <th className="p-4 border-1 border-[var(--color-navbar)]">
                          المنتج
                        </th>
                        <th className="p-4 border-1 border-[var(--color-navbar)]">
                          اللون
                        </th>
                        <th className="p-4 border-1 border-[var(--color-navbar)]">
                          الحجم
                        </th>
                        <th className="p-4 border-1 border-[var(--color-navbar)]">
                          الكمية
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((item, i) => (
                        <tr
                          className="border-1 border-[var(--color-navbar)]"
                          dir="rtl"
                          key={i}
                        >
                          <td className="p-4 border-1 border-[var(--color-navbar)]">
                            {item.productId}
                          </td>
                          <td className="p-4 border-1 border-[var(--color-navbar)] flex justify-center items-center">
                            <Avatar src={item.image} className="w-16 h-16" />
                          </td>
                          <td className="p-4 border-1 border-[var(--color-navbar)]">
                            <p
                              className="w-4 h-4 rounded-full"
                              style={{ backgroundColor: item.color }}
                            ></p>
                          </td>
                          <td className="p-4 border-1 border-[var(--color-navbar)]">
                            <select
                              value={
                                productSelections[item.productId]?.size || ""
                              }
                              onChange={(e) =>
                                handleProductSelectionChange(
                                  item.productId,
                                  "size",
                                  e.target.value
                                )
                              }
                              className="input"
                            >
                              <option value="">اختر الحجم</option>
                              {item.sizes.map((size) => (
                                <option key={size._id} value={size.size}>
                                  {size.size}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="p-4 border-1 border-[var(--color-navbar)]">
                            <input
                              type="number"
                              value={
                                productSelections[item.productId]?.quantity ||
                                ""
                              }
                              onChange={(e) =>
                                handleProductSelectionChange(
                                  item.productId,
                                  "quantity",
                                  +e.target.value > 1
                                    ? Math.min(
                                        parseInt(e.target.value),
                                        item.sizes.find(
                                          (size) =>
                                            size.size ===
                                            productSelections[item.productId]
                                              ?.size
                                        )?.amount || 0
                                      )
                                    : 1
                                )
                              }
                              className="input"
                              placeholder="أدخل الكمية"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="w-[100%] flex justify-center items-center mt-1 ">
                  <Autocomplete
                    isLoading={loading}
                    isDisabled={loading}
                    label="أختر المخزن"
                    className="[w-[100%] border-dashed border-2 border-[var(--color-navbar)] rounded-xl cursor-pointer"
                    selectedKey={selectedStore}
                    onSelectionChange={(key) => {
                      setSlectedStore(key !== null ? String(key) : "");
                    }}
                  >
                    {(
                      Cities.find((cityFind) => cityFind.name === selectedCity)
                        ?.stores || []
                    )
                      .filter((item) => item._id !== idStore)
                      .map((store) => (
                        <AutocompleteItem
                          key={store.nameStore}
                          value={store.nameStore}
                        >
                          {store.nameStore}
                        </AutocompleteItem>
                      ))}
                  </Autocomplete>

                  <Autocomplete
                    isLoading={loading}
                    isDisabled={loading}
                    label="أختر المدينة"
                    className="[w-[100%] border-dashed border-2 border-[var(--color-navbar)] ml-1 rounded-xl cursor-pointer"
                    selectedKey={selectedCity}
                    onSelectionChange={(key) => {
                      if (key !== null) {
                        setSlectedCity(String(key));
                      } else {
                        setSlectedCity("");
                      }
                    }}
                  >
                    {Cities.map((cityItem) => (
                      <AutocompleteItem
                        key={cityItem.name}
                        value={cityItem.name}
                      >
                        {cityItem.name}
                      </AutocompleteItem>
                    ))}
                  </Autocomplete>
                </div>
              </ModalBody>

              <ModalFooter>
                <Button
                  color="danger"
                  variant="light"
                  onPress={onClose}
                  className="h-12"
                >
                  إلغاء
                </Button>
                <Button
                  onClick={handleSubmit}
                  isLoading={isSubmitting}
                  isDisabled={isSubmitting}
                  className="w-[100%] h-12 bg-[var(--color-navbar)] border-1"
                >
                  تم
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
