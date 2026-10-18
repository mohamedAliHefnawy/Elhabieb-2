"use client";

// REACT
import React, { useEffect, useState } from "react";
import { TwitterPicker } from "react-color";
import { Camera } from "lucide-react";
import CryptoJS from "crypto-js";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

// COMPONENTS & STORE
import Icons from "@/iconsSvg";
import {
  Card,
  CardBody,
  Tabs,
  Tab,
  Spinner,
  Input,
  Button,
} from "@nextui-org/react";

// FIREBASE
import {
  storage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "@/fireBase/fireBaseConfig";

// SESSION DATA
import getSessionData, { SessionData } from "@/contexts/SessionContext";
import axios from "axios";
import Alert from "../Alert";
import useSessionData from "@/hooks/useSessionData";

export default function BodyProfile() {
  const keyHash = process.env.NEXT_PUBLIC_KEY_HASH;
  const apiEndpoint = process.env.NEXT_PUBLIC_LINK_API;
  const router = useRouter();

  const sessionData = useSessionData();
  const [phoneMarketer, setPhoneMarketer] = useState("");
  const [phoneCompany, setPhoneCompany] = useState("");
  const [password, setPassword] = useState("");
  const [passwordNew, setPasswordNew] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordNew, setShowPasswordNew] = useState(false);
  const [color, setColor] = useState("#FF6900");
  const [imgPerson, setImgPerson] = useState<string | null>(null);
  const [imgCompany, setImgCompany] = useState<string | null>(null);
  const [nameCompany, setNameCompany] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const [previewImagePerson, setPreviewImagePerson] = useState<
    string | ArrayBuffer | null
  >(null);
  const [previewImageCompany, setPreviewImageCompany] = useState<
    string | ArrayBuffer | null
  >(null);
  const [uploading, setUploading] = useState<boolean>(false);

  const handleChangeComplete = (newColor: any) => setColor(newColor.hex);

  const handleUploadImage = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "person" | "company"
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === "person") {
          setPreviewImagePerson(reader.result);
        } else {
          setPreviewImageCompany(reader.result);
        }
      };
      reader.readAsDataURL(file);

      setUploading(true);
      const imageRef = ref(storage, `images/${file.name}`);
      try {
        await uploadBytes(imageRef, file);
        const imageUrl = await getDownloadURL(imageRef);
        if (type === "person") {
          setImgPerson(imageUrl);
        } else {
          setImgCompany(imageUrl);
        }
      } catch (error) {
        console.error("Error uploading image:", error);
      } finally {
        setUploading(false);
      }
    }
  };

  const ImageUploader = ({ type }: { type: "person" | "company" }) => (
    <div className="flex flex-col items-center relative mt-3">
      {uploading && (type === "person" ? imgPerson : imgCompany) ? (
        <div className="w-32 h-32 relative">
          <img
            src={type === "person" ? imgPerson! : imgCompany!}
            alt="Preview"
            className="w-full h-full object-cover rounded-full opacity-50"
          />
          <div className="absolute inset-0 flex justify-center items-center bg-opacity-50 rounded-full">
            <Spinner size="lg" color="default" />
          </div>
        </div>
      ) : (
          type === "person"
            ? imgPerson || previewImagePerson
            : imgCompany || previewImageCompany
        ) ? (
        <label
          htmlFor={type === "person" ? "imgPerson" : "imgCompany"}
          className="w-32 h-32 rounded-full bg-gray-50 relative"
        >
          <input
            type="file"
            id={type === "person" ? "imgPerson" : "imgCompany"}
            className="hidden"
            onChange={(e) => handleUploadImage(e, type)}
          />
          <div
            className="absolute inset-0 bg-cover bg-center rounded-full"
            style={{
              backgroundImage: `url(${
                type === "person"
                  ? imgPerson || previewImagePerson
                  : imgCompany || previewImageCompany
              })`,
            }}
          ></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Camera size={28} strokeWidth={1} className="text-white" />
          </div>
        </label>
      ) : (
        <label
          htmlFor={type === "person" ? "imgPerson" : "imgCompany"}
          className="relative w-32 h-32 cursor-pointer"
        >
          <img
            src={sessionData?.image}
            alt="Preview"
            className="w-32 h-32 object-cover rounded-full opacity-50"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <Camera size={28} strokeWidth={1} className="text-white" />
          </div>
          <input
            type="file"
            id={type === "person" ? "imgPerson" : "imgCompany"}
            className="hidden"
            onChange={(e) => handleUploadImage(e, type)}
          />
        </label>
      )}
    </div>
  );

  const ProfileTabs = () => (
    <Tabs
      aria-label="Profile Options"
      defaultSelectedKey="1"
      color="warning"
      className="overflow-x-auto flex flex-col items-start"
      dir="rtl"
      variant="underlined"
    >
      <Tab key="1" title={<p className="pb-2">المعلومات الشخصية</p>}>
        <Card>
          <CardBody>
            <form className="xl:flex lg:flex md:flex sm:block max-sm:block items-center">
              <div className="w-full mr-3">
                <Input
                  className="h-12 w-[100%] text-center mb-2 text-warning-400"
                  variant="flat"
                  color="warning"
                  type="text"
                  label="َ"
                  value={sessionData?.email}
                  disabled
                />
                <div className="flex ">
                  <Input
                    className="h-12 w-[100%] ml-1 text-warning-400"
                    variant="bordered"
                    color="warning"
                    type="number"
                    label="رقم الهاتف"
                    value={phoneMarketer}
                    onChange={(e) => setPhoneMarketer(e.target.value)}
                  />
                  <Input
                    className="h-12 xl:w-[20%] lg:w-[20%] md:w-[20%] sm:w-[50%] max-sm:w-[50%] ml-1 text-warning-400"
                    variant="bordered"
                    color="warning"
                    type="text"
                    label="نوع الحساب"
                    value={sessionData?.validity}
                    disabled
                  />
                </div>
              </div>
              <ImageUploader type="person" />
            </form>
            <div>
              <Button
                onClick={handleSubmit}
                isLoading={isSubmitting}
                isDisabled={isSubmitting}
                color="warning"
                variant="shadow"
                className="w-full mt-4 text-white"
              >
                تعديل
              </Button>
            </div>
          </CardBody>
        </Card>
      </Tab>
      <Tab key="2" title={<p className="pb-2">تغيير كلمة المرور</p>}>
        <Card>
          <CardBody>
            <form className="flex flex-col space-y-4">
              <div className="relative">
                <Input
                  className=""
                  variant="bordered"
                  color="warning"
                  type={showPassword ? "text" : "password"}
                  label="كلمة المرور الحالية"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute text-[var(--color-matg3er)] inset-y-0 right-0 flex items-center pr-4 cursor-pointer"
                >
                  {showPassword ? Icons.EyeIcon : Icons.EyeNotIcon}
                </span>
              </div>
              <div className="relative">
                <Input
                  className=""
                  variant="bordered"
                  color="warning"
                  type={showPassword ? "text" : "password"}
                  label="كلمة المرور الجديدة"
                  value={passwordNew}
                  onChange={(e) => setPasswordNew(e.target.value)}
                />
                <span
                  onClick={() => setShowPasswordNew(!showPasswordNew)}
                  className="absolute text-[var(--color-matg3er)] inset-y-0 right-0 flex items-center pr-4 cursor-pointer"
                >
                  {showPassword ? Icons.EyeIcon : Icons.EyeNotIcon}
                </span>
              </div>
            </form>
            <div>
              <Button
                onClick={handleSubmit}
                isLoading={isSubmitting}
                isDisabled={isSubmitting}
                color="warning"
                variant="shadow"
                className="w-full mt-4 text-white"
              >
                تعديل
              </Button>
            </div>
          </CardBody>
        </Card>
      </Tab>
      {sessionData?.validity === "Markter" && (
        <Tab key="3" title={<p className="pb-2">الشركة</p>}>
          <Card>
            <CardBody>
              <div className="space-y-4 flex flex-col items-center">
                <TwitterPicker
                  color={color}
                  onChangeComplete={handleChangeComplete}
                />
                <div className="w-full" style={{ backgroundColor: color }}>
                  <ImageUploader type="company" />
                </div>
                <input
                  type="text"
                  className="input"
                  placeholder="إسم الشركة"
                  value={nameCompany || ""}
                  onChange={(e) => setNameCompany(e.target.value)}
                />
                <input
                  type="text"
                  className="input"
                  placeholder="رقم هاتف الشركة"
                  value={phoneCompany}
                  onChange={(e) => setPhoneCompany(e.target.value)}
                />
              </div>
              <div>
                <Button
                  onClick={handleSubmit}
                  isLoading={isSubmitting}
                  isDisabled={isSubmitting}
                  color="warning"
                  variant="shadow"
                  className="w-full mt-4 text-white"
                >
                  تعديل
                </Button>
              </div>
            </CardBody>
          </Card>
        </Tab>
      )}
    </Tabs>
  );

  const handleSubmit = async () => {
    if (password !== "") {
      if (password.length < 9 || passwordNew.length < 9) {
        Alert("warning", "يجب أن لا تقل كلمة المرور عن 9 ");
        return;
      }
    }
    if (!keyHash) {
      return;
    }
    const dataToEncrypt = {
      phone: phoneMarketer,
      phoneCompany,
      password,
      passwordNew,
      color,
      image: imgPerson,
      imgCompany,
      nameCompany,
    };
    const encryptedData = CryptoJS.AES.encrypt(
      JSON.stringify(dataToEncrypt),
      keyHash
    ).toString();
    setIsSubmitting(true);

    try {
      const response = await axios.post(
        `${apiEndpoint}user/editUser/${sessionData?.email}`,
        {
          data: encryptedData,
        }
      );

      if (response.data === "PASSWORD_ERROR") {
        Alert("error", "كلمة المرور القديمة خاطئة");
      } else if (response.data === "EDITED_SUCCESS") {
        Alert("success", "تم تعديل حسابك بنجاح");
        Cookies.remove("session");
        router.push("/auth/signin");
      } else {
        Alert("error", "توجد مشكلة في الإنترنت حاول تنشيط الصفحة");
        new Audio("/mp3/proplemInternet.mp3").play();
      }
    } catch (error) {
      console.error("Error submitting data", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchSessionData = async () => {
      if (sessionData) {
        setImgPerson(sessionData.image);
        setPreviewImagePerson(sessionData.image);
        setPhoneMarketer(sessionData.phone);
        setPhoneCompany(sessionData.company.phone);
        setColor(sessionData.company.color);
        setImgCompany(sessionData.company.image);
        setNameCompany(sessionData.company.name);
      }
    };

    fetchSessionData();
  }, []);

  return (
    <div>
      {sessionData ? (
        <div className="w-full mb-96">
          <div
            className="bg-[var(--color-navbar)] w-full h-80 flex justify-center items-end bg-cover"
            style={{
              backgroundImage: `url(${
                imgPerson ? imgPerson : sessionData.image
              })`,
            }}
          >
            <div className="xl:w-3/4 lg:w-3/4 md:w-3/4 sm:w-4/4 max-sm:w-4/4 h-auto z-50 border-2 border-dashed border-[var(--color-matg3er)] bg-white  rounded-3xl absolute top-40">
              <div className="p-4 overflow-x-auto whitespace-nowrap">
                {ProfileTabs()}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center h-screen">
          <Spinner color="warning" />
        </div>
      )}
    </div>
  );
}
