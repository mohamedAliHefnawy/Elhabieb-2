// REACT
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";

// COMPONENTS & STORE
import { RootState, AppDispatch } from "@/src/store";
import { fetchSuppliers } from "@/features/supplierSlice";
import Icons from "@/iconsSvg";

// NEXT UI
import { Avatar, Spinner } from "@nextui-org/react";
import { Mouse } from "lucide-react";

const PageSuppliers: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const isInitialLoad = useRef(true);

  const [searchQuery, setSearchQuery] = useState<string>("");
  const { suppliers, loading } = useSelector(
    (state: RootState) => state.supplier
  );

  const filteredSuppliers = suppliers.filter((supplier) =>
    supplier.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const HeaderFilters = () => (
    <div className="flex flex-col mb-10">
      <div className="flex justify-between items-center mb-4">
        <Link
          className="flex items-center gap-x-2 bg-[var(--color-navbar)] h-12 w-[12%]  mr-1 p-2 rounded-xl "
          href="/dashboard/suppliers/add"
        >
          <p>{Icons.PlusIcon}</p>
          <p>إضافة مورد</p>
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
        <p>Total {filteredSuppliers.length} Suppliers</p>
      </div>
    </div>
  );

  const HeaderTableSuppliers = () => (
    <div
      className="flex items-center p-4 mb-5 bg-[var(--color-body)] border-1 shadow-sm rounded-2xl text-black opacity-75"
      dir="rtl"
    >
      <div className="w-full flex justify-center text-black opacity-50">
        الصورة
      </div>
      <div className="w-full flex justify-center text-black opacity-50">
        الإسم
      </div>
      <div className="w-full flex justify-center text-black opacity-50">
        رقم هاتف
      </div>
      <div className="w-full flex justify-center text-black opacity-50">
        الفواتير
      </div>
      <div className="w-full flex justify-center">-</div>
    </div>
  );

  const TableSuppliers = () => (
    <>
      {filteredSuppliers.length === 0 ? (
        <div className="flex justify-center items-center h-[400px] text-black opacity-50">
          <p>لا يوجد أي موردين</p>
        </div>
      ) : (
        filteredSuppliers.map((supplier) => (
          <div
            key={supplier._id}
            className="flex items-center p-4 mb-2 bg-[var(--color-body)] shadow-lg rounded-2xl border-1 border-[var(--color-navbar)] text-black"
          >
            <div className="w-full flex justify-center">
              <Avatar src={supplier.image} size="lg" />
            </div>
            <div className="w-full flex justify-center opacity-75">
              <p>{supplier.name}</p>
            </div>
            <div className="w-full flex justify-center opacity-75">
              <p>{supplier.phone}</p>
            </div>
            <div className="w-full flex justify-center opacity-75 text-orange-500 ">
              <Link
                className="cursor-pointer flex items-center"
                href={`/dashboard/suppliers/invoices/${supplier._id}`}
              >
                <p>إضغط للدخول</p>
                <Mouse strokeWidth={1.25} />
              </Link>
            </div>
            <div className="w-full flex justify-center opacity-75">
              <Link href={`/dashboard/suppliers/edit/${supplier._id}`}>
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
      dispatch(fetchSuppliers());
      isInitialLoad.current = false;
    }
  }, [dispatch]);

  return (
    <div className="h-screen w-full bg-[var(--color-body)] border-1 border-[var(--color-navbar)] overflow-y-auto custom-scrollbar p-6 mt-1">
      {HeaderFilters()}
      <HeaderTableSuppliers />
      <div dir="rtl">
        {loading ? (
          <div className="flex justify-center items-center h-[400px]">
            <Spinner size="lg" color="success" />
          </div>
        ) : (
          <TableSuppliers />
        )}
      </div>
    </div>
  );
};

export default PageSuppliers;
