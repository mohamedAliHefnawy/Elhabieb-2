"use client";

// React
import React, { useState } from "react";
import axios from "axios";
import CryptoJS from "crypto-js";
import { usePathname } from "next/navigation";

// Components
import { Button, Radio, RadioGroup, Spinner } from "@nextui-org/react";
import Icons from "@/iconsSvg";
import Alert from "@/Components/Alert";

// FIREBASE
import {
  storage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "@/fireBase/fireBaseConfig";

export default function AddPerson({ type }: { type: string }) {
  const keyHash = process.env.NEXT_PUBLIC_KEY_HASH;
  const apiEndpoint = process.env.NEXT_PUBLIC_LINK_API;
  const path = usePathname();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    validity: type,
    password: "",
    passwordWallet: "",
  });

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const [img, setImg] = useState<string | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [previewImage, setPreviewImage] = useState<string | ArrayBuffer | null>(
    null
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const setSelectedVariant = (value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      validity: value,
    }));
  };

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
        setFormData((prev) => ({ ...prev, image: imageUrl }));
      } catch (error) {
        console.error("Error uploading image:", error);
      } finally {
        setUploading(false);
      }
    }
  };

  const ImageUploader = () => (
    <div className="flex flex-col items-center relative">
      {uploading ? (
        <div className="w-48 h-48 relative">
          {previewImage && (
            <img
              src={previewImage as string}
              alt="Preview"
              className="w-full h-full object-cover rounded-full opacity-50"
            />
          )}
          <div className="absolute inset-0 flex justify-center items-center bg-[var(--color-body)] bg-opacity-50 rounded-full">
            <Spinner size="lg" color="success" />
          </div>
        </div>
      ) : img || previewImage ? (
        <label
          htmlFor="img"
          className="flex flex-col items-center justify-center w-48 h-48 border-2 border-dashed border-gray-300 rounded-full bg-gray-50 hover:bg-gray-100 cursor-pointer transition relative"
          style={{
            backgroundImage: `url(${img || previewImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <input
            type="file"
            id="img"
            className="hidden"
            onChange={handleUploadImage}
          />
          <div className="absolute inset-0 flex justify-center items-center bg-gray-200 bg-opacity-50 rounded-full">
            <div className="text-gray-500 text-4xl">{Icons.PhotoIcon}</div>
          </div>
        </label>
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
  );

  const Body = () => {
    return (
      <div
        className="h-screen w-full bg-[var(--color-body)] border-1 border-[var(--color-navbar)] overflow-y-auto custom-scrollbar p-6 mt-1"
        dir="rtl"
      >
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">
          إضافة {type} جديد
        </h2>
        <form>
          <div>
            <ImageUploader />

            <div className="grid grid-cols-2 gap-3 gap-y-7 mt-10">
              <div className="flex flex-col">
                <label htmlFor="name" className="text-gray-700 mb-2">
                  الاسم
                </label>
                <input
                  className="input"
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="email" className="text-gray-700 mb-2">
                  البريد الإلكتروني
                </label>
                <input
                  className="input"
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <div className="flex flex-col">
                  <label htmlFor="password" className="text-gray-700 mb-2">
                    كلمة المرور
                  </label>
                  <input
                    className="input"
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
                {path === "/dashboard/marketer/add" && (
                  <div className="flex flex-col mt-3">
                    <label
                      htmlFor="passwordWallet"
                      className="text-gray-700 mb-2"
                    >
                      كلمة المرور للمحفظة
                    </label>
                    <input
                      className="input"
                      type="password"
                      id="passwordWallet"
                      name="passwordWallet"
                      value={formData.passwordWallet}
                      onChange={handleChange}
                      required
                    />
                  </div>
                )}
              </div>
              <div>
                <div className="flex flex-col">
                  <label htmlFor="phone" className="text-gray-700 mb-2">
                    رقم الهاتف
                  </label>
                  <input
                    className="input"
                    type="number"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="flex flex-col">
                <label htmlFor="position" className="text-gray-700 mb-2">
                  الوظيفة
                </label>
                <RadioGroup
                  orientation="horizontal"
                  color="success"
                  value={type}
                  size="lg"
                  className="mt-3"
                >
                  <Radio value="Admin" className="capitalize">
                    أدمن
                  </Radio>
                  <Radio value="Employ" className="capitalize mx-5">
                    موظف
                  </Radio>
                  <Radio value="Client" className="capitalize ">
                    زبون عادي
                  </Radio>
                  <Radio value="Markter" className="capitalize mx-5">
                    مندوب تسويق
                  </Radio>
                  <Radio value="Delivery" className="capitalize ml-3 mt-2">
                    مندوب توصيل
                  </Radio>
                </RadioGroup>
              </div>
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <Button
              variant="shadow"
              className="w-[100%] h-16 mt-6 opacity-75 bg-[var(--color-navbar)]"
              isLoading={isSubmitting}
              disabled={isSubmitting}
              onClick={handleSubmit}
            >
              إضافة {type}
            </Button>
          </div>
        </form>
      </div>
    );
  };

  const handleSubmit = async () => {
    if (formData.password.length < 7) {
      Alert("warning", "يجب أن لا تقل كلمة المرور عن 7 ");
      new Audio("/mp3/errorPassword.mp3").play();
      return;
    }

    if (!keyHash) {
      return;
    }
    const dataToEncrypt = {
      ...formData,
    };
    const encryptedData = CryptoJS.AES.encrypt(
      JSON.stringify(dataToEncrypt),
      keyHash
    ).toString();
    setIsSubmitting(true);

    try {
      const response = await axios.post(`${apiEndpoint}user/addUser`, {
        data: encryptedData,
      });

      if (response.data === "ADDED_SUCCESS") {
        Alert("success", "تم إضافة المستخدم بنجاح");
        new Audio("/mp3/addUserSusess.mp3").play();
      } else if (response.data === "USER_FOUND") {
        Alert("warning", "هذا الإيميل موجود بالفعل");
        new Audio("/mp3/userExited.mp3").play();
      }
    } catch (error) {
      console.error("Error submitting data", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return <>{Body()}</>;
}
