// src/components/ImageUpload.tsx

import React from 'react';
import { Avatar, Button, Spinner } from '@nextui-org/react';
import { storage, ref, uploadBytes, getDownloadURL } from '@/fireBase/fireBaseConfig';

interface ImageUploadProps {
  images: string[];
  selectedFiles: File[];
  isUploading: boolean;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onUpload: () => void;
  onImageDelete: (index: number) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  images,
  selectedFiles,
  isUploading,
  onFileChange,
  onUpload,
  onImageDelete,
}) => {
  // const handleUpload = async () => {
  //   setIsUploading(true);
  //   const promises = selectedFiles.map(async (file) => {
  //     const storageRef = ref(storage, `images/${file.name}`);
  //     await uploadBytes(storageRef, file);
  //     const url = await getDownloadURL(storageRef);

  //     return url;
  //   });

  //   try {
  //     const imageUrls = await Promise.all(promises);
  //     setFormData((prev) => ({
  //       ...prev,
  //       images: [...prev.images, ...imageUrls],
  //     }));
  //     setSelectedFiles([]);
  //   } catch (error) {
  //     console.error("Error uploading images:", error);
  //   } finally {
  //     setIsUploading(false); // انتهاء التحميل
  //   }
  // };

  return (
    <div className="border-dashed border-t-1 border-gray-400 p-5 flex">
      <div className="w-[65%]">
        <div className="text-center mb-4">
          <h3 className="text-xl font-semibold text-gray-800">رفع الصور</h3>
          <p className="text-gray-600">
            سحب وإفلات الصور هنا أو انقر لاختيار الصور من جهازك
          </p>
        </div>
        <div className="flex flex-col items-center">
          <label
            htmlFor="fileInput"
            className="w-full text-center p-4 py-8 border-2 border-dashed border-gray-400 rounded-lg cursor-pointer hover:border-gray-600 transition-colors duration-300"
          >
            <input
              type="file"
              id="fileInput"
              className="hidden"
              multiple
              onChange={onFileChange}
            />
            <span className="text-gray-700">اختر أو اسحب الصور هنا</span>
          </label>
          <Button onClick={onUpload} className="mt-4 w-[100%]">
            رفع الصور
          </Button>
          {isUploading && (
            <div className="mt-4">
              <Spinner size="lg" color="default" />
              <p className="text-gray-600 mt-2">جاري رفع الصور...</p>
            </div>
          )}
          <div className="mt-4 flex flex-wrap gap-4">
            {images.length > 0 ? (
              images.map((url, index) => (
                <div key={index} className="relative">
                  <Avatar
                    src={url}
                    alt={`Uploaded ${index}`}
                    className="w-32 h-32 rounded-full"
                  />
                  <button
                    className="absolute top-0 right-0 text-red-500 text-3xl rounded-full p-1 m-2"
                    onClick={() => onImageDelete(index)}
                  >
                    ×
                  </button>
                </div>
              ))
            ) : (
              <p className="text-gray-600">لا توجد صور لعرضها</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageUpload;
