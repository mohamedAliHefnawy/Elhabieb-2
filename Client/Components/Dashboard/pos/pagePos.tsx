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
import { fetchPos } from "@/features/pos";
import { PencilRuler } from "lucide-react";

const PagePos = () => {
  const dispatch = useDispatch<AppDispatch>();
  const isInitialLoad = useRef(true);

  const [searchQuery, setSearchQuery] = useState<string>("");
  const { pos, loading, error } = useSelector((state: RootState) => state.pos);

  const filteredPos = pos.filter((pos) =>
    pos.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const HeaderFilters = () => (
    <div className="flex flex-col mb-4">
      <div className="flex justify-between items-center">
        <Link className="w-[15%] mr-1" href={"/dashboard/pos/add"}>
          <Button className="w-full bg-[var(--color-navbar)] h-12 border-1">
            إضافة pos
          </Button>
        </Link>
        <div className="w-[100%]">
          <input
            type="text"
            placeholder=" بحث ..."
            className="w-[100%] input"
            // onChange={handleSearchChange}
            // value={searchText}
          />
        </div>
        {/* <ModelAddEmplyee titleButton="إضافة موظف" inputName="إسم الموظف" /> */}
      </div>
      <div className="mt-4 ml-2 text-black opacity-60 text-sm mr-3 text-end">
        <p>Total {filteredPos.length} kasheer</p>
      </div>
    </div>
  );

  const HeaderTablePos = () => (
    <div
      className="flex items-center p-4 mb-5 bg-[var(--color-body)] border-1 shadow-sm rounded-2xl text-black opacity-75"
      dir="rtl"
    >
      {[
        "الصورة",
        "الإسم",
        "رقم الهاتف",
        "المخزن",
        "الدفع",
        "password",
        "-",
      ].map((header, index) => (
        <div
          key={index}
          className="w-full flex justify-center text-black opacity-50"
        >
          {header}
        </div>
      ))}
    </div>
  );

  const TablePos = () => (
    <>
      {filteredPos.length === 0 ? (
        <div className="flex justify-center items-center h-[400px] text-black opacity-50">
          <p>لا يوجد أي كاشير</p>
        </div>
      ) : (
        filteredPos.map((pos) => (
          <div
            key={pos._id}
            className="flex items-center p-4 mb-2 bg-[var(--color-body)] shadow-lg rounded-2xl border border-[var(--color-navbar)] text-black"
          >
            <div className="w-full flex justify-center">
              <Avatar
                className={`outline-2 outline-green-800`}
                src={pos.image}
                size="lg"
              />
            </div>
            <div className="w-full flex justify-center opacity-75">
              <p>{pos.email.split('@')[0]}</p>
            </div>
            <div className="w-full flex justify-center opacity-75">
              <p>{pos.phone}</p>
            </div>
            <div className="w-full flex justify-center opacity-75">
              <p>
                {pos.city} | {pos.store}
              </p>
            </div>
            <div className="w-full flex justify-center opacity-75">
              <p>{pos.moneysafe}</p>
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
                  <p>{pos.password}</p>
                </PopoverContent>
              </Popover>
            </div>

            <div className="w-full flex justify-center opacity-75">
              <Link href={`/dashboard/pos/edit/${pos._id}`}>
                <p className="hover:cursor-pointer hover:opacity-75 p-3 rounded-full">
                  <PencilRuler strokeWidth={1} size={28} />
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
      dispatch(fetchPos());
      isInitialLoad.current = false;
    }
  }, [dispatch]);

  return (
    <div className="h-screen w-full bg-[var(--color-body)] border-1 border-[var(--color-navbar)] overflow-y-auto custom-scrollbar p-6 mt-1">
      {HeaderFilters()}
      {HeaderTablePos()}
      <div dir="rtl">
        {loading ? (
          <div className="flex justify-center items-center h-[400px]">
            <Spinner size="lg" color="success" />
          </div>
        ) : (
          <TablePos />
        )}
      </div>
    </div>
  );
};

export default PagePos;
