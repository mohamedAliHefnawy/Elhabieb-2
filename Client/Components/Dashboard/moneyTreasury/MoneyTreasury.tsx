// REACT
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";

// COMPONENTS & STORE
import { RootState, AppDispatch } from "@/src/store";
import { fetchMoneyTreasuries } from "@/features/moneyTreasurySlice";
import Icons from "@/iconsSvg";
import { Spinner } from "@nextui-org/react";

const PageMoneyTreasuries: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const isInitialLoad = useRef(true);

  const [searchQuery, setSearchQuery] = useState<string>("");
  const { moneyTreasuries, loading } = useSelector(
    (state: RootState) => state.moneyTreasury
  );

  // # Filter MoneyTreasuries
  const filteredMoneyTreasuries = moneyTreasuries.filter((moneyTreasury) =>
    moneyTreasury.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // # Header Filters
  const HeaderFilters = () => (
    <div className="flex flex-col mb-10">
      <div className="flex justify-between items-center mb-4">
        <Link
          className="flex items-center gap-x-2 bg-[var(--color-navbar)] h-12 w-[15%]  mr-1 p-2 rounded-xl "
          href="/dashboard/moneyTreasury/add"
        >
          <p>{Icons.PlusIcon}</p>
          <p>إضافة خزينة جديدة</p>
        </Link>
        <div className="w-[90%]">
          <input
            className="w-full input"
            type="text"
            placeholder="بحث ..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      <div className="ml-2 mr-2 text-black opacity-60 text-sm flex justify-end">
        <p>Total {filteredMoneyTreasuries.length} MoneyTreasuries</p>
      </div>
    </div>
  );

  const TableOrders = () => (
    <>
      {filteredMoneyTreasuries.length === 0 ? (
        <div className="flex justify-center items-center h-[400px] text-black opacity-50">
          <p>لا يوجد أي خزائن</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-10">
          {filteredMoneyTreasuries.map((moneyTreasury, i) => (
            <div dir="rtl" key={i}>
              <div className="bg-[var(--color-body)] p-6 rounded-xl shadow-lg hover:scale-105 transition-transform duration-300">
                {moneyTreasury.Active ? (
                  <Link href={`/dashboard/moneyTreasury/${moneyTreasury._id}`}>
                    <img
                      src={moneyTreasury.image}
                      alt="Treasury Image"
                      className="w-full h-40 object-cover rounded-lg mb-4"
                    />
                  </Link>
                ) : (
                  <img
                    src={moneyTreasury.image}
                    alt="Treasury Image"
                    className="w-full h-40 object-cover rounded-lg mb-4 opacity-50 border-2 border-dashed border-red-600"
                  />
                )}

                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-black mb-2">
                      {moneyTreasury.name}
                    </h2>
                    <p
                      className={`${
                        moneyTreasury.money.reduce(
                          (calc, i) => calc + i.valueMoney,
                          0
                        ) <= 0
                          ? "text-red-700"
                          : "text-green-700"
                      }`}
                    >
                      <span>الرصيد : </span>
                      {moneyTreasury.money.reduce(
                        (calc, i) => calc + i.valueMoney,
                        0
                      )}
                      <span className="mr-1">دينار ليبي</span>
                    </p>
                  </div>
                  <div className="flex flex-col items-center">
                    <p
                      className={`w-3 h-3 ${
                        moneyTreasury.Active ? "bg-green-700" : "bg-red-700"
                      } shadow-2xl shadow-green-700 rounded-full`}
                    ></p>

                    <Link
                      href={`/dashboard/moneyTreasury/edit/${moneyTreasury._id}`}
                      className=" p-2 rounded-full opacity-55 text-black hover:cursor-pointer transition-transform duration-300 ease-in-out transform hover:scale-110 flex items-center justify-center"
                    >
                      {Icons.PencilIcon}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );

  useEffect(() => {
    if (isInitialLoad.current) {
      dispatch(fetchMoneyTreasuries());
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
          <TableOrders />
        )}
      </div>
    </div>
  );
};

export default PageMoneyTreasuries;
