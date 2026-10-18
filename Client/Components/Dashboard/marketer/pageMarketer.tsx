"use client";

// REACT
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";

// NEXT UI
import {
  Avatar,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Button,
  Spinner,
} from "@nextui-org/react";

// COMPONENTS & STORE
import { fetchMarkters } from "@/features/userSlice";
import { RootState, AppDispatch } from "@/src/store";
import Icons from "@/iconsSvg";

const PageMarketer = () => {
  const dispatch = useDispatch<AppDispatch>();
  const isInitialLoad = useRef(true);

  const [searchQuery, setSearchQuery] = useState<string>("");
  const { users, loading, error } = useSelector(
    (state: RootState) => state.user
  );

  const filteredMarketers = users.filter((user) =>
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const HeaderFilters = () => (
    <div className="flex flex-col mb-4">
      <div className="flex justify-between items-center mb-4">
        <Link
          className="flex items-center gap-x-2 bg-[var(--color-navbar)] h-12 w-[19%]  mr-1 p-2 rounded-xl"
          href="/dashboard/marketer/add"
        >
          <p>{Icons.PlusIcon}</p>
          <p>إضافة مندوب تسويق</p>
        </Link>
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
        <p>totla {filteredMarketers.length} Marketer</p>
      </div>
    </div>
  );

  const HeaderTableMarketers = () => (
    <div
      className="flex items-center p-4 mb-5 bg-[var(--color-body)] shadow-lg rounded-2xl text-black opacity-75"
      dir="rtl"
    >
      {["الصورة", "الإسم", "email #", "رقم الهاتف", "password", "-"].map(
        (header, index) => (
          <div
            key={index}
            className="w-full flex justify-center text-black opacity-50"
          >
            {header}
          </div>
        )
      )}
    </div>
  );

  const TableMarketers = () => (
    <>
      {filteredMarketers.length === 0 ? (
        <div className="flex justify-center items-center h-[400px] text-black opacity-50">
          <p>لا يوجد أي مندوبين تسويق</p>
        </div>
      ) : (
        filteredMarketers.map((user) => (
          <div
            key={user._id}
            className="flex items-center p-4 mb-2 bg-[var(--color-body)] shadow-lg rounded-2xl border border-[var(--color-navbar)] text-black"
          >
            <div className="w-full flex justify-center">
              <Avatar
                className={`outline-2 outline-green-800`}
                src={user.image}
                size="lg"
              />
            </div>
            <div className="w-full flex justify-center opacity-75">
              <p>{user.email.split("@")[0]}</p>
            </div>
            <div className="w-full flex justify-center opacity-75">
              <p>...@{user.email.split("@")[0]}</p>
            </div>
            <div className="w-full flex justify-center opacity-75">
              <p>{user.phone}</p>
            </div>
            <div className="w-full flex justify-center opacity-75">
              <Popover placement="right">
                <PopoverTrigger>
                  <p className="cursor-pointer flex items-center text-orange-500">
                    <span>إضغط للإظهار</span>
                    <span className="mr-1 pt-1">{Icons.EyeIcon}</span>
                  </p>
                </PopoverTrigger>
                <PopoverContent className="p-3">
                  <p>{user.password}</p>
                </PopoverContent>
              </Popover>
            </div>

            <div className="w-full flex justify-center opacity-75">
              <Link href={`/dashboard/marketer/edit/${user._id}`}>
                <p className="hover:cursor-pointer hover:opacity-75 p-3 rounded-full">
                  {Icons.PencilIcon}
                </p>
              </Link>
            </div>
          </div>
        ))
      )}
    </>
  );

  useEffect(() => {
    if (isInitialLoad.current) {
      dispatch(fetchMarkters());
      isInitialLoad.current = false;
    }
  }, [dispatch]);

  return (
    <div className="h-screen w-full bg-[var(--color-body)] border-1 border-[var(--color-navbar)] overflow-y-auto custom-scrollbar p-6 mt-1">
      {HeaderFilters()}
      {HeaderTableMarketers()}
      <div dir="rtl">
        {loading ? (
          <div className="flex justify-center items-center h-[400px]">
            <Spinner size="lg" color="success" />
          </div>
        ) : (
          <TableMarketers />
        )}
      </div>
    </div>
  );
};

export default PageMarketer;
