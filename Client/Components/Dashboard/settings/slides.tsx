import React, { useEffect, useRef, useState } from "react";
import imageMain from "@/public/images/1212.png";
import slider5 from "@/public/images/slider5.jpeg";
import slider1 from "@/public/images/slider1.jpeg";
import slider3 from "@/public/images/slider3.jpeg";
import Icons from "@/iconsSvg";
import { Button } from "@nextui-org/react";
import { AlignEndVertical, Camera, Trash2 } from "lucide-react";
import {
  storage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "@/fireBase/fireBaseConfig";
import axios from "axios";
import Alert from "@/Components/Alert";
import CryptoJS from "crypto-js";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/src/store";
import { fetchSettings } from "@/features/settingsSlice";

export default function SlidesMatger() {
  const keyHash = process.env.NEXT_PUBLIC_KEY_HASH;
  const apiEndpoint = process.env.NEXT_PUBLIC_LINK_API;
  const isInitialLoad = useRef(true);
  const dispatch = useDispatch<AppDispatch>();
  const { settings } = useSelector((state: RootState) => state.settings);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const handleUploadImage = async (files: FileList) => {
    setUploading(true);
    const updatedImages: string[] = [...images]; // تحديد نوع البيانات هنا

    const filesArray = Array.from(files);

    for (const file of filesArray) {
      const imageRef = ref(storage, `images/${file.name}`);
      try {
        await uploadBytes(imageRef, file);
        const imageUrl = await getDownloadURL(imageRef);
        updatedImages.push(imageUrl);
      } catch (error) {
        console.error("Error uploading image:", error);
      } finally {
        setUploading(false);
      }
    }

    setImages(updatedImages);
  };

  const handleChooseImages = () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "images/*";
    fileInput.multiple = true;

    fileInput.onchange = (event) => {
      const target = event.target as HTMLInputElement;
      if (target && target.files) {
        handleUploadImage(target.files);
      }
    };

    fileInput.click();
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setImages(images.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = async () => {
    if (!keyHash) {
      return;
    }
    const dataToEncrypt = {
      images,
    };

    const encryptedData = CryptoJS.AES.encrypt(
      JSON.stringify(dataToEncrypt),
      keyHash
    ).toString();
    setIsSubmitting(true);

    try {
      const response = await axios.post(`${apiEndpoint}settings/editImages`, {
        data: encryptedData,
      });

      if (response.data === "SUCCESS") {
        new Audio("/mp3/DoneSucess.mp3").play();
        Alert("success", "تمت العملية بنجاح");
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
    if (isInitialLoad.current) {
      dispatch(fetchSettings());
      isInitialLoad.current = false;
    }
  }, [dispatch]);

  useEffect(() => {
    if (settings) {
      setImages(settings.mat3ger.images);
    }
  }, [settings]);

  return (
    <div className="flex flex-col items-center">
      <div className="w-[100%] ">
        <p className="mb-3 flex items-center justify-center gap-x-1" dir="rtl">
          <AlignEndVertical strokeWidth={1} /> تظبيط Slides المتجر
        </p>

        <div className="relative flex flex-col items-center">
          <div className="relative h-[450px] w-[80%]">
            {images.map((img, index) => (
              <div key={index} className="relative">
                <img
                  src={img}
                  alt={`Slide ${index + 1}`}
                  className={`absolute z-40 transition-opacity duration-500 h-[450px] w-full object-cover rounded-[15px] shadow-md border border-blue-200 ${
                    index === currentImageIndex
                      ? "opacity-100 z-10"
                      : "opacity-0 z-0"
                  }`}
                />
                <button
                  className="absolute top-4 z-50 right-4 bg-red-500 text-white p-2 rounded-full"
                  onClick={() => handleRemoveImage(index)}
                >
                  <Trash2 size={28} strokeWidth={1.25} />
                </button>
              </div>
            ))}

            {uploading && (
              <div className="absolute inset-0 z-50 flex items-center justify-center bg-white bg-opacity-50 rounded-[15px]">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            )}
          </div>

          <button
            className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white bg-opacity-50 p-2 rotate-90 rounded-full z-20"
            onClick={prevImage}
          >
            {Icons.ChevrondownIcon}
          </button>
          <button
            className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white bg-opacity-50 p-2 -rotate-90 rounded-full z-20"
            onClick={nextImage}
          >
            {Icons.ChevrondownIcon}
          </button>
          <button
            className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white p-3 rounded-full"
            onClick={handleChooseImages}
            disabled={uploading}
          >
            <Camera size={28} strokeWidth={1.25} />
          </button>
        </div>

        <div className="flex justify-center w-full mt-[20px]">
          <div className="relative w-[80%] flex justify-center gap-x-[20px]">
            {images.slice(0, 2).map((img, index) => (
              <div key={index} className="relative w-full">
                <img
                  className="w-full h-40 border border-blue-200 shadow-md object-cover rounded-[15px]"
                  src={img}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      <Button
        className="w-[100%] h-12 mt-3 bg-[var(--color-navbar)] border-1"
        onClick={() => handleSubmit()}
        isLoading={isSubmitting}
        isDisabled={isSubmitting}
      >
        حفظ
      </Button>
    </div>
  );
}
