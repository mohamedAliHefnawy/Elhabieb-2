// REACT
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";

// COMPONENTS & STORE
import { RootState, AppDispatch } from "@/src/store";
import { fetchCities } from "@/features/citiesSlice";
import Icons from "@/iconsSvg";

// NEXT UI
import { Button, Avatar, Spinner } from "@nextui-org/react";

const PageCities: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const isInitialLoad = useRef(true);

  const [searchQuery, setSearchQuery] = useState<string>("");
  const { Cities = [], loading } = useSelector(
    (state: RootState) => state.city
  );

  const filteredCities = (Cities || []).filter((city) =>
    city.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const HeaderFilters = () => (
    <div className="flex flex-col mb-10">
      <div className="flex justify-between items-center mb-4">
        <Link href="/dashboard/cities/add">
          <Button
            className="h-12 bg-[var(--color-navbar)] border-1"
            startContent={Icons.PlusIcon}
          >
            إضافة مدينة
          </Button>
        </Link>
        <div className="w-[97%] ml-1">
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
        <p>Total {filteredCities.length} Cities</p>
      </div>
    </div>
  );

  const TableCities = () => (
    <>
      {filteredCities.length === 0 ? (
        <div className="flex justify-center items-center h-[400px] text-black opacity-50">
          <p>لا يوجد أي مدن</p>
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-2">
          {filteredCities.map((city) => (
            <div
              key={city._id}
              className="relative p-4 bg-[var(--color-body)] shadow-lg rounded-2xl border-1 border-[var(--color-navbar)] text-black transition-transform duration-300 ease-in-out transform hover:scale-95"
            >
              <Link
                href={`/dashboard/cities/edit/${city._id}`}
                className="absolute top-2 right-2 p-2 bg-[var(--color-navbar)] rounded-full opacity-55 text-black hover:cursor-pointer transition-transform duration-300 ease-in-out transform hover:scale-110 flex items-center justify-center"
              >
                {Icons.PencilIcon}
              </Link>

              <Link key={city._id} href={`/dashboard/cities/${city._id}`}>
                <h1 className="text-center text-2xl">{city.name}</h1>

                <div className="flex justify-center gap-2 mt-4">
                  <div className="border-1 border-slate-500 rounded-3xl opacity-55 p-4 flex flex-col items-center">
                    <p>المخازن</p>
                    <p>( {city.stores.length} )</p>
                  </div>
                  <div className="border-1 border-slate-500 rounded-3xl opacity-55 p-4 flex flex-col items-center">
                    <p>المناطق</p>
                    <p>( {city.prices.length} )</p>
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
    if (isInitialLoad.current) {
      dispatch(fetchCities());
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
          <TableCities />
        )}
      </div>
    </div>
  );
};

export default PageCities;
