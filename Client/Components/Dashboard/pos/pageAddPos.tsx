//react
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { getUnixTime } from "date-fns";
// import linkServer from "@/linkServer";
import Icons from "@/iconsSvg";
import { TwitterPicker } from "react-color";
import CryptoJS from "crypto-js";

//nextui
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Tabs,
  Tab,
  Card,
  CardBody,
  Avatar,
  Spinner,
  Input,
  Autocomplete,
  AutocompleteItem,
} from "@nextui-org/react";

//compenents
import {
  storage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "@/fireBase/fireBaseConfig";

import Swal from "sweetalert2";
import { Eye, EyeClosed } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/src/store";
import { fetchCities } from "@/features/citiesSlice";
import { fetchMoneyTreasuries } from "@/features/moneyTreasurySlice";
import Alert from "@/Components/Alert";

export default function PageAddPos() {
  const keyHash = process.env.NEXT_PUBLIC_KEY_HASH;
  const apiEndpoint = process.env.NEXT_PUBLIC_LINK_API;
  const dispatch = useDispatch<AppDispatch>();
  const isInitialLoad = useRef(true);

  const [img, setImg] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [colorkasheer, setColorkasheer] = useState("#FCB900");
  const [phoneCompany, setPhoneCompany] = useState("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [uploading, setUploading] = useState<boolean>(false);
  const [previewImage, setPreviewImage] = useState<string | ArrayBuffer | null>(
    null
  );
  const [isVisible, setIsVisible] = React.useState(false);
  const [selectedMoneyTreasury, setSlectedMoneyTreasury] = React.useState("");
  const [selectedCity, setSlectedCity] = React.useState("");
  const [selectedStore, setSlectedStore] = React.useState("");
  const { moneyTreasuries, loading: moneyTreasuriesLoading } = useSelector(
    (state: RootState) => state.moneyTreasury
  );
  const { Cities = [], loading: citiesLoading } = useSelector(
    (state: RootState) => state.city
  );

  const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);

      setUploading(true);
      const imageRef = ref(storage, `images/${file.name}`);

      try {
        await uploadBytes(imageRef, file);
        const imageUrl = await getDownloadURL(imageRef);
        setImg(imageUrl);
      } catch (error) {
        console.error("Error uploading image:", error);
      } finally {
        setUploading(false);
      }
    }
  };

  const handleChangekasheer = (newColor: any) => {
    setColorkasheer(newColor.hex);
  };

  const TabDataKasheer = () => {
    return (
      <form className="flex flex-col justify-center items-center">
        <div className="flex flex-col items-center relative w-full">
          {uploading && !img && previewImage ? (
            <div className="w-48 h-48 relative">
              <img
                src={previewImage as string}
                alt="Preview"
                className="w-full h-full object-cover rounded-full opacity-50"
              />
              <div className="absolute inset-0 flex justify-center items-center bg-[var(--color-navbar)] bg-opacity-50 rounded-full">
                <Spinner size="lg" color="default" />
              </div>
            </div>
          ) : img ? (
            <div
              className="w-48 h-48 bg-cover bg-center rounded-full"
              style={{ backgroundImage: `url(${img})` }}
            ></div>
          ) : (
            <label
              htmlFor="img"
              className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-md bg-gray-50 hover:bg-gray-100 cursor-pointer transition relative"
            >
              <div className="text-gray-500 text-4xl">{Icons.PhotoIcon}</div>
              <span className="mt-2 text-sm text-gray-500">
                اضغط هنا لتحميل الصورة
              </span>
              <input
                type="file"
                id="img"
                className="hidden"
                onChange={handleUploadImage}
              />
            </label>
          )}
        </div>
        <div className="mt-8 w-full">
          <div className="flex gap-2">
            <Input
              type="text"
              label="الإيميل"
              variant="bordered"
              color="primary"
              placeholder="أدخل gmail الكاشير"
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
            <Input
              type="number"
              label="رقم الهاتف"
              variant="bordered"
              color="primary"
              placeholder="أدخل رقم الهاتف"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <Input
            label="Password"
            placeholder="أدخل كلمة المرور"
            variant="bordered"
            color="primary"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            endContent={
              <button
                className="focus:outline-none"
                type="button"
                onClick={() => setIsVisible(!isVisible)}
                aria-label="toggle password visibility"
              >
                {isVisible ? (
                  <EyeClosed strokeWidth={1} />
                ) : (
                  <Eye strokeWidth={1} />
                )}
              </button>
            }
            type={isVisible ? "text" : "password"}
            className="w-full mt-2"
          />
        </div>
      </form>
    );
  };

  const TabDataKasheerCompany = () => {
    return (
      <form className="flex flex-col justify-center items-center">
        <div
          className=" w-[100%] h-48 flex justify-center items-center p-5 rounded-xl"
          style={{ backgroundColor: `${colorkasheer}` }}
        >
          <TwitterPicker
            className="w-[100%]"
            color={colorkasheer}
            onChangeComplete={handleChangekasheer}
          />
        </div>

        <Input
          type="text"
          label="رقم الهاتف"
          variant="bordered"
          color="primary"
          placeholder="أدخل رقم الهاتف"
          value={phoneCompany}
          onChange={(e) => setPhoneCompany(e.target.value)}
          className="mt-2"
        />
      </form>
    );
  };

  const TabMoneyStore = () => {
    return (
      <>
        <div className="w-[100%] flex justify-center items-center mt-1 ">
          <Autocomplete
            isLoading={moneyTreasuriesLoading}
            isDisabled={moneyTreasuriesLoading}
            label="إختر المحفظة"
            className="[w-[100%] border-dashed border-2 border-[var(--color-navbar)] rounded-2xl cursor-pointer flex justify-center"
            selectedKey={selectedMoneyTreasury}
            onSelectionChange={(key) => {
              setSlectedMoneyTreasury(key !== null ? String(key) : "");
            }}
          >
            {moneyTreasuries.map((item) => (
              <AutocompleteItem key={item.name} value={item.name}>
                {item.name}
              </AutocompleteItem>
            ))}
          </Autocomplete>
        </div>
      </>
    );
  };

  const TabStore = () => {
    return (
      <>
        <div className="w-[100%] flex justify-center items-center mt-1 ">
          <Autocomplete
            isLoading={citiesLoading}
            isDisabled={citiesLoading}
            label="أختر المخزن"
            className="[w-[100%] border-dashed border-2 border-[var(--color-navbar)] rounded-2xl cursor-pointer"
            selectedKey={selectedStore}
            onSelectionChange={(key) => {
              setSlectedStore(key !== null ? String(key) : "");
            }}
          >
            {(
              Cities.find((cityFind) => cityFind.name === selectedCity)
                ?.stores || []
            ).map((store) => (
              <AutocompleteItem key={store.nameStore} value={store.nameStore}>
                {store.nameStore}
              </AutocompleteItem>
            ))}
          </Autocomplete>

          <Autocomplete
            label="أختر المدينة"
            className="[w-[100%] border-dashed border-2 border-[var(--color-navbar)] rounded-2xl ml-1 cursor-pointer"
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
              <AutocompleteItem key={cityItem.name} value={cityItem.name}>
                {cityItem.name}
              </AutocompleteItem>
            ))}
          </Autocomplete>
        </div>
      </>
    );
  };

  const tabs = () => {
    return (
      <>
        <div className="flex w-full flex-col">
          <Tabs
            color="warning"
            variant="underlined"
            defaultSelectedKey="1"
            dir="rtl"
          >
            <Tab key="1" title={<p className="pb-3">المعلومات الشخصية</p>}>
              {TabDataKasheer()}
            </Tab>
            <Tab key="2" title={<p className="pb-3">الشركة</p>}>
              {TabDataKasheerCompany()}
            </Tab>
            <Tab key="3" title={<p className="pb-3">طريقة الدفع</p>}>
              {TabMoneyStore()}
            </Tab>
            <Tab key="4" title={<p className="pb-3">المخزن</p>}>
              {TabStore()}
            </Tab>
          </Tabs>
        </div>
      </>
    );
  };

  const handleSubmit = async () => {
    if (!name.includes("@")) {
      Alert("error", "أدخل بريد إلكتروني صحيح من فضلك");
      return;
    }

    if (password.length < 9) {
      Alert("warning", "يجب أن لا تقل كلمة المرور عن 9");
      return;
    }
    if (!keyHash) {
      return;
    }
    const dataToEncrypt = {
      img,
      name,
      phone,
      password,
      colorkasheer,
      phoneCompany,
      selectedMoneyTreasury,
      selectedCity,
      selectedStore,
    };
    const encryptedData = CryptoJS.AES.encrypt(
      JSON.stringify(dataToEncrypt),
      keyHash
    ).toString();
    setIsSubmitting(true);

    try {
      const response = await axios.post(`${apiEndpoint}pos/addPos`, {
        data: encryptedData,
      });

      if (response.data === "ADDED_SUCCESS") {
        Alert("success", "تم إضافة ال كاشير بنجاح");
        new Audio("/mp3/susess_added_catogry.mp3").play();
      } else if (response.data === "EXITED_SURE") {
        Alert("error", "عذراَ هذا الإسم مستخدم من قبل");
        new Audio("/mp3/sorry.mp3").play();
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
      dispatch(fetchMoneyTreasuries());

      isInitialLoad.current = false;
    }
  }, [dispatch]);

  return (
    <>
      <div className="h-screen w-full bg-[var(--color-body)] border-1 border-[var(--color-navbar)] overflow-y-auto custom-scrollbar p-6 mt-1">
        {tabs()}
        <div className="fixed bottom-3 w-[81%]">
          <Button
            onClick={handleSubmit}
            isLoading={isSubmitting}
            isDisabled={isSubmitting}
            className="w-full h-12 bg-[var(--color-navbar)] border-1"
          >
            إضافة كاشير
          </Button>
        </div>
      </div>
    </>
  );
}
