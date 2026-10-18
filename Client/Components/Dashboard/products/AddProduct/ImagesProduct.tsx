import { useState, useEffect } from "react";
import {
  storage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "@/fireBase/fireBaseConfig";
import { Avatar, Button, Spinner } from "@nextui-org/react";

interface ImagesProps {
  productData: string[];
  onChange: (updatedImages: string[]) => void;
}

export default function Images({ productData, onChange }: ImagesProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [images, setImages] = useState<string[]>(productData || []);

  useEffect(() => {
    setImages(productData || []);
  }, [productData]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const handleUpload = async () => {
    setIsUploading(true);
    const promises = selectedFiles.map(async (file) => {
      const storageRef = ref(storage, `images/${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      return url;
    });

    try {
      const imageUrls = await Promise.all(promises);
      const updatedImages = [...images, ...imageUrls];
      setImages(updatedImages);
      onChange(updatedImages);
      setSelectedFiles([]);
    } catch (error) {
      console.error("Error uploading images:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleImageDelete = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
    onChange(updatedImages); 
  };

  return (
    <div className="w-[65%] mt-9">
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
            onChange={handleFileChange}
          />
          <span className="text-gray-700">اختر أو اسحب الصور هنا</span>
        </label>
        <Button onClick={handleUpload} className="mt-4 w-[100%] bg-[var(--color-navbar)] border-1">
          رفع الصور
        </Button>
        {isUploading && (
          <div className="mt-4 flex flex-col items-center">
            <Spinner size="lg" color="default" />
            <p className="text-gray-600 mt-2">جاري رفع الصور ...</p>
          </div>
        )}
        <div className="mt-4 flex flex-wrap gap-4">
          {images.length > 0 ? (
            images.map((url, index) => (
              <div key={index} className="relative">
                <Avatar
                  src={url}
                  alt={`Uploaded ${index}`}
                  className="w-20 h-20 rounded-full"
                />
                <button
                  className="absolute top-0 right-0 text-red-500 text-3xl rounded-full p-1 m-2"
                  onClick={() => handleImageDelete(index)}
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
  );
}
