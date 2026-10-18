// REACT
import React, { useEffect, useRef, useState } from "react";
import { TwitterPicker } from "react-color";
import CryptoJS from "crypto-js";
import axios from "axios";
import { Eye, EyeClosed } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { usePathname, useRouter } from "next/navigation";

// COMPONETS & STORE
import Icons from "@/iconsSvg";
import { AppDispatch, RootState } from "@/src/store";
import { fetchCities } from "@/features/citiesSlice";
import { fetchMoneyTreasuries } from "@/features/moneyTreasurySlice";
import Alert from "@/Components/Alert";

// NEXT UI
import {
  Button,
  Tabs,
  Tab,
  Spinner,
  Input,
  Autocomplete,
  AutocompleteItem,
} from "@nextui-org/react";

// FIREBASE
import {
  storage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "@/fireBase/fireBaseConfig";
import { fetchPosById } from "@/features/pos";

export default function PageEditPos() {
  const keyHash = process.env.NEXT_PUBLIC_KEY_HASH;
  const apiEndpoint = process.env.NEXT_PUBLIC_LINK_API;
  const dispatch = useDispatch<AppDispatch>();
  const isInitialLoad = useRef(true);
  const path = usePathname();
  const router = useRouter();

  const [img, setImg] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [colorkasheer, setColorkasheer] = useState("");
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
  const { onePos = null, loading: posLoading } = useSelector(
    (state: RootState) => state.pos
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
            <div className="relative w-48 h-48">
              <div
                className="w-48 h-48 bg-cover bg-center rounded-full"
                style={{ backgroundImage: `url(${img})` }}
              ></div>
              <label
                htmlFor="img"
                className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full cursor-pointer hover:bg-opacity-70"
              >
                <span className="text-white">تعديل الصورة</span>
                <input
                  type="file"
                  id="img"
                  className="hidden"
                  onChange={handleUploadImage}
                />
              </label>
            </div>
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
              type="email"
              label="الإيميل"
              variant="bordered"
              color="primary"
              placeholder="أدخل gmail الكاشير"
              value={name}
              disabled
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
            defaultInputValue={selectedMoneyTreasury}
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
            defaultInputValue={selectedStore}
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
            defaultInputValue={selectedCity}
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
      const response = await axios.post(`${apiEndpoint}pos/editPos`, {
        data: encryptedData,
      });

      if (response.data === "EDITED_SUCCESS") {
        Alert("success", "تم تعديل ال كاشير بنجاح");
        router.push("/dashboard/pos");
        // new Audio("/mp3/susess_added_catogry.mp3").play();
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
      dispatch(fetchPosById(path.split("/dashboard/pos/edit/")[1]));

      isInitialLoad.current = false;
    }
  }, [dispatch]);

  useEffect(() => {
    if (onePos) {
      setImg(onePos.image);
      setName(onePos.email);
      setPhone(onePos.phone);
      setPassword(onePos.password);
      setColorkasheer(onePos.colorCompany);
      setPhoneCompany(onePos.phoneCompany);
      setSlectedMoneyTreasury(onePos.moneysafe);
      setSlectedCity(onePos.city);
      setSlectedStore(onePos.store);
    }
  }, [onePos]);

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
            تعديل الكاشير
          </Button>
        </div>
      </div>
    </>
  );
}
