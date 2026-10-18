import Icons from "@/iconsSvg";
import { Avatar, Tab, Tabs } from "@nextui-org/react";
import { useState } from "react";
import PreviousWork2 from "@/public/images/product2.png";
import { motion } from "framer-motion";
import ReactStars from "react-stars";
import AddComment from "../AddComment";

export default function ProductReviews({ rating }: { rating: number }) {
  const [showFullText, setShowFullText] = useState(false);
  const [likeProject, setLikeProject] = useState<boolean>(false);

  const toggleText = () => {
    setShowFullText(!showFullText);
  };

  return (
    <div>
      <div className="bg-center flex justify-center items-end border-1 border-slate-300">
        <div
          className="w-[100%] bg-white dark:bg-[#202230] p-4 hover:cursor-pointer"
          dir="rtl"
        >
          <div className="flex items-center mb-4">
            <p className="text-sm opacity-65 ml-4 flex items-start">
              <span>{Icons.Clock}</span>
              <span>منذ 9 دقائق</span>
            </p>
          </div>

          <div className="flex items-center justify-between">
            <motion.p
              className={`text-center text-lg leading-loose ${
                showFullText
                  ? "whitespace-normal"
                  : "whitespace-nowrap overflow-hidden"
              }`}
              initial={{ width: "50%" }}
              animate={{ width: showFullText ? "100%" : "50%" }}
              transition={{ duration: 0.5 }}
            >
              ترجمه 100 كلمه فرنساوي لل العربية سيسي سيسمست سهستر سيتسسب ترجمه
              100 كلمه فرنساوي لل العربية سيسي سيسمست سهستر سيتسسب ترجمه 100
              كلمه فرنساوي لل العربية سيسي سيسمست سهستر سيتسسب ترجمه 100 كلمه
              فرنساوي لل العربية سيسي سيسمست سهستر سيتسسب
            </motion.p>
            <button
              onClick={toggleText}
              className="text-blue-500 w-[10%] text-sm"
            >
              {showFullText ? "أقل" : "المزيد"}
            </button>
          </div>

          <div className="flex justify-between items-center my-4">
            <ReactStars
              count={5}
              value={rating}
              size={20}
              edit={false}
              color1="#cccccc"
              color2="#ffc107"
            />
            <p className="flex items-center">
              <span className="ml-2">mohamed ali</span>
              <Avatar src={PreviousWork2.src} size="sm" />
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
