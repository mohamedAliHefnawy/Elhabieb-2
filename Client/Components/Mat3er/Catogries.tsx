"use client";

// REACT
import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";

// COMPONENTS & STORE
import { fetchCategories } from "@/features/categorySlice";
import { RootState, AppDispatch } from "@/src/store";
import { Avatar, Spinner } from "@nextui-org/react";

const Catogries = () => {
  const dispatch = useDispatch<AppDispatch>();
  const isInitialLoad = useRef(true);
  const { categories, loading } = useSelector(
    (state: RootState) => state.category
  );

  const Catogry = (image: string, name: string) => {
    return (
      <div className="flex flex-col items-center hover:cursor-pointer mb-6 min-w-[100px]">
        <div className="bg-[var(--color-matg3er)] rounded-full xl:h-24 lg:h-24 md:h-24 sm:h-16 max-sm:h-16 xl:w-24 lg:w-24 md:w-24 sm:w-16 max-sm:w-16">
          <Avatar
            className="xl:h-24 lg:h-24 md:h-24 sm:h-16 max-sm:h-16 xl:w-24 lg:w-24 md:w-24 sm:w-16 max-sm:w-16"
            src={image || "/default-image.png"}
            size="lg"
          />
        </div>
        <p className="mt-1 text-center">{name}</p>
      </div>
    );
  };

  useEffect(() => {
    if (isInitialLoad.current) {
      dispatch(fetchCategories());
      isInitialLoad.current = false;
    }
  }, [dispatch]);

  return (
    <>
      {categories &&
        categories.filter((item) => item.Active !== false).length > 0 && (
          <div className="flex justify-end mr-1 my-4 mt-8">
            <Link
              className="bg-[var(--color-matg3er-rgb)] p-3 rounded-full hover:bg-[var(--color-matg3er)] text-white"
              href={"/Categories"}
            >
              كل الأقسام
            </Link>
          </div>
        )}
      {loading ? (
        <div className="w-[100%] flex justify-center items-center h-32">
          <Spinner color="default" size="lg" />
        </div>
      ) : (
        <>
          <div className="px-1">
            <div className="flex flex-col">
              <div className="flex justify-evenly gap-x-2 mb-2 max-w-full overflow-x-auto">
                {categories
                  .filter((item) => item.Active !== false)
                  .map((category, index) => (
                    <Link
                      key={index}
                      className="w-[100%]"
                      href={`/Categories/Category/${encodeURIComponent(
                        category.name
                      )}`}
                    >
                      {Catogry(category.image, category.name)}
                    </Link>
                  ))}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Catogries;
