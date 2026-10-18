"use client";

// REACT
import { DNA } from "react-loader-spinner";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";

// COMPONENTS
import Alert from "../Alert";
import { fetchCategories } from "@/features/categorySlice";
import { AppDispatch, RootState } from "@/src/store";

// NEXT UI
import { Avatar } from "@nextui-org/react";

// IMAGES
import Logo from "@/public/images/hbaieb.png";
import { StepBack, StepForward } from "lucide-react";

export default function HeaderCatogries() {
  const dispatch = useDispatch<AppDispatch>();
  const isInitialLoad = useRef(true);
  const colorCompany = Cookies.get("colorPos");

  const { categories, loading, error } = useSelector(
    (state: RootState) => state.category
  );

  if (error) {
    Alert("error", "توجد مشكلة في الإنترنت حاول تنشيط الصفحة");
    new Audio("/mp3/proplemInternet.mp3").play();
    return;
  }

  const [selectedFilter, setSelectedFilter] = useState("all");
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200;
      scrollContainerRef.current.scrollLeft +=
        direction === "left" ? -scrollAmount : scrollAmount;
    }
  };

  const handleFilterChange = (filter: any) => {
    setSelectedFilter(filter);
  };

  const filterOptions = Array.from(
    new Set(
      categories
        .filter((item) => item.Active === true)
        .map((category) =>
          JSON.stringify({
            name: category.name,
            image: category.image,
          })
        )
    )
  ).map((item) => JSON.parse(item));

  useEffect(() => {
    if (isInitialLoad.current) {
      dispatch(fetchCategories());
      isInitialLoad.current = false;
    }
  }, [dispatch]);

  return (
    <div className="relative max-w-full">
      <p
        className="absolute left-0 top-1/4 mt-3 transform -translate-y-1/2 z-10 p-2 rounded-full cursor-pointer"
        onClick={() => handleScroll("left")}
      >
        <StepBack size={25} strokeWidth={0.5} />
      </p>

      <div
        ref={scrollContainerRef}
        className="flex gap-x-4 overflow-x-auto scrollbar-default mx-10 "
      >
        <button
          key="all"
          onClick={() => handleFilterChange("all")}
          className="flex flex-col items-center gap-1 rounded-xl px-4 py-2"
        >
          <Avatar
            src={Logo.src}
            className={`w-16 h-16 border-2 ${
              selectedFilter === "all" ? "" : "border-gray-300"
            }`}
            style={{
              borderColor: selectedFilter === "all" ? colorCompany : undefined,
            }}
          />
          <span
            className={`text-sm ${
              selectedFilter === "all" ? "" : "text-gray-600"
            }`}
            style={{
              color: selectedFilter === "all" ? colorCompany : undefined,
            }}
          >
            كل الأقسام
          </span>
        </button>

        {loading ? (
          <div className="flex items-center justify-center w-full">
            <DNA
              visible={true}
              height="80"
              width="80"
              ariaLabel="dna-loading"
            />
          </div>
        ) : (
          filterOptions.map((option) => (
            <button
              key={option.name}
              onClick={() => handleFilterChange(option.name)}
              className="flex flex-col items-center gap-1 rounded-xl px-4 py-2"
            >
              <Avatar
                src={option.image}
                className={`w-16 h-16 border-2 ${
                  selectedFilter === option.name ? "" : "border-gray-300"
                }`}
                style={{
                  borderColor:
                    selectedFilter === option.name ? colorCompany : undefined,
                }}
              />

              <span
                className={`text-sm ${
                  selectedFilter === option.name ? "" : "text-gray-600"
                }`}
                style={{
                  color:
                    selectedFilter === option.name ? colorCompany : undefined,
                }}
              >
                {option.name}
              </span>
            </button>
          ))
        )}
      </div>

      <p
        className="absolute right-0 top-1/4 mt-3 transform -translate-y-1/2 z-10 p-2 rounded-full cursor-pointer"
        onClick={() => handleScroll("right")}
      >
        <StepForward size={25} strokeWidth={0.5} />
      </p>
    </div>
  );
}
