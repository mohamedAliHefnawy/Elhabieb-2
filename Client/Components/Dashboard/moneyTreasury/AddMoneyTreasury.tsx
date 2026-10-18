// src/pages/AddMoneyTreasury.tsx

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/src/store";
import { Button, Radio, RadioGroup, Spinner } from "@nextui-org/react";
import CryptoJS from "crypto-js";
import axios from "axios";
import Icons from "@/iconsSvg";
import {
  storage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "@/fireBase/fireBaseConfig";
import Alert from "@/Components/Alert";

// # AddMoneyTreasury Component
export default function AddMoneyTreasury() {
  const keyHash = process.env.NEXT_PUBLIC_KEY_HASH;
  const apiEndpoint = process.env.NEXT_PUBLIC_LINK_API;

  const [img, setImg] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedVariant, setSelectedVariant] = useState("نعم");
  const [uploading, setUploading] = useState<boolean>(false);
  const [previewImage, setPreviewImage] = useState<string | ArrayBuffer | null>(
    null
  );

  const [formData, setFormData] = useState({
    name: "",
    image: "",
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // # Handle Input Changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // # Handle Image Upload
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

  // # Handle Form Submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!keyHash) {
      return;
    }

    const dataToEncrypt = {
      ...formData,
      Active: selectedVariant === "نعم" ? true : false,
      dateAdded: new Date().toLocaleDateString(),
      timeAdded: new Date().toLocaleTimeString(),
    };

    const encryptedData = CryptoJS.AES.encrypt(
      JSON.stringify(dataToEncrypt),
      keyHash
    ).toString();

    setIsSubmitting(true);

    try {
      setLoading(true);
      const response = await axios.post(
        `${apiEndpoint}moneyTreasury/addMoneyTreasury`,
        { data: encryptedData }
      );

      if (response.data === "ADDED_SUSESS") {
        Alert("success", "تم إضافة الخزينة بنجاح");
        new Audio("/mp3/susess_added_catogry.mp3").play();
        setFormData({
          name: "",
          image: "",
        });
        setPreviewImage("");
        setImg("");
        setSelectedVariant("نعم");
      } else if (response.data === "EXIT_SURE") {
        Alert("error", "عذراَ هذا الإسم مستخدم من قبل");
        new Audio("/mp3/sorry.mp3").play();
      }

      setLoading(false);
    } catch (error) {
      console.error("Error submitting data", error);
      setLoading(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  // # Component Render
  return (
    <div
      className="h-screen w-full bg-[var(--color-body)] border-1 border-[var(--color-navbar)] overflow-y-auto custom-scrollbar p-6 mt-1"
      dir="rtl"
    >
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">
        إضافة خزينة جديد
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col items-center relative">
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

        {/* # Form Fields Section */}
        <div className="grid grid-cols-2 gap-3 gap-y-7 mt-10">
          <div className="flex flex-col">
            <label htmlFor="name" className="text-gray-700 mb-2">
              إسم الخزينة
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
          <div className="flex flex-col mt-6 mr-10">
            <label htmlFor="position" className="text-gray-700 mb-2">
              نشط أم لا ؟
            </label>
            <RadioGroup
              orientation="horizontal"
              color="default"
              defaultValue="نعم"
              onValueChange={(value) => {
                setSelectedVariant(value);
              }}
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
          </div>
        </div>

        {/* # Submit Button Section */}
        <div className="mt-6 flex justify-end">
          <Button
            type="submit"
            disabled={isSubmitting}
            isLoading={isSubmitting}
            className="w-full h-16 mt-6 bg-[var(--color-navbar)] border-1"
          >
            إضافة خزينة جديد
          </Button>
        </div>
      </form>
    </div>
  );
}
