import React, { use, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Avatar, Spinner } from "@nextui-org/react";
import { RootState, AppDispatch } from "@/src/store";
import { fetchStores } from "@/features/storesSlice";
import { useParams } from "next/navigation";

import Link from "next/link";
import Icons from "@/iconsSvg";

const PageStoresInStores: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const isInitialLoad = useRef(true);

  const { slug } = useParams() || "";
  const { Stores = [], loading } = useSelector(
    (state: RootState) => state.store
  );

  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredStores = (Stores || []).filter((store) =>
    store.nameStore.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const HeaderFilters = () => (
    <div className="flex flex-col mb-10">
      <div className="flex justify-end items-center mb-4">
        <div className="w-[100%]">
          <input
            className="w-full input"
            type="text"
            placeholder="بحث ..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      <div className="mr-2 text-black opacity-60 text-sm flex justify-end">
        <p>Total {filteredStores.length} Stores</p>
      </div>
    </div>
  );

  const TableStores = () => (
    <>
      {filteredStores.length === 0 ? (
        <div className="flex justify-center items-center h-[400px] text-black opacity-50">
          <p>لا يوجد أي مخازن في هذه المدينة</p>
        </div>
      ) : (
        <div className="grid grid-cols-5 gap-2">
          {filteredStores.map((store) => (
            <div
              key={store._id}
              className="relative p-4 bg-[var(--color-body)] shadow-lg rounded-2xl border-1 border-[var(--color-navbar)] text-black transition-transform duration-300 ease-in-out transform hover:scale-95"
            >
              <Link
                key={store._id}
                href={`/dashboard/cities/${slug}/${store._id}`}
              >
                <h1 className="text-2xl mr-4">{store.nameStore}</h1>
                <div className="flex flex-col justify-center gap-2 mt-4">
                  <div className="flex items-end">
                    <p className="opacity-60">❉</p>
                    <p className="mb-[2px] mr-1 opacity-85">
                      يحتوي علي
                      <span className="font-bold mx-2">
                        {store.products.length}
                      </span>
                      منتج .
                    </p>
                  </div>
                  <div className="flex items-end">
                    <p className="opacity-60">❉</p>
                    <p className="mb-[2px] mr-1 opacity-85">
                      كود المخزن{" "}
                      <span className="font-bold">{store.codeStore}</span> .
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </>
  );

  useEffect(() => {
    if (isInitialLoad.current && typeof slug === "string") {
      dispatch(fetchStores(slug));
      isInitialLoad.current = false;
    }
  }, [dispatch]);

  return (
    <div className="h-screen w-full bg-[var(--color-body)] border-1 border-[var(--color-navbar)] overflow-y-auto custom-scrollbar p-6 mt-1">
      {HeaderFilters()}
      <div dir="rtl">
        {loading ? (
          <div className="flex justify-center items-center h-[400px]">
            <Spinner size="lg" color="success" />
          </div>
        ) : (
          <TableStores />
        )}
      </div>
    </div>
  );
};

export default PageStoresInStores;
