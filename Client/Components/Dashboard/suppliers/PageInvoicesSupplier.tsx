// REACT
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ShoppingBasket } from "lucide-react";
import { usePathname } from "next/navigation";

// COMPONENTS & STORE
import { RootState, AppDispatch } from "@/src/store";
import {
  fetchInvoicesSupplier,
  InvoicesSupplier,
} from "@/features/supplierSlice";
import ModelPayInvoice from "./ModelPayInvoice";
import ModelShowProductsInInvoice from "./ModelShowProductsInInvoice";

// NEXT UI
import { Spinner } from "@nextui-org/react";
import Alert from "@/Components/Alert";
import Icons from "@/iconsSvg";

const PageInvoicesSupplier: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const isInitialLoad = useRef(true);
  const path = usePathname().split("/");

  const invoiceId = path[path.length - 1];

  const [searchQuery, setSearchQuery] = useState<string>("");
  const { invoicesSupplier, loading } = useSelector(
    (state: RootState) => state.supplier
  );

  const [allInvoices, setAllInvoices] = useState<InvoicesSupplier[]>([]);

  const filteredInvoicesSuppliers = allInvoices.filter((invoice) =>
    invoice._id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const Sucess = (data: any) => {
    setAllInvoices((prev) =>
      prev.map((item) => {
        if (item._id === data.idInvoice) {
          return {
            ...item,
            paymentMoneyDetails: [
              ...item.paymentMoneyDetails,
              {
                valueMoney: +data.moneyValue,
                employ: "",
                date: "",
                time: "",
              },
            ],
          };
        }
        return item;
      })
    );
  };

  const HeaderFilters = () => (
    <div className="flex flex-col mb-6">
      <div className="w-[100%]">
        <input
          className="w-full input"
          type="text"
          placeholder="بحث ..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="mr-2 mt-3 text-black opacity-60 text-sm flex justify-center">
        <p>Total {filteredInvoicesSuppliers.length} Invoices</p>
      </div>
    </div>
  );

  const TableInvoices = () => (
    <>
      {filteredInvoicesSuppliers.length === 0 ? (
        <div className="flex justify-center items-center h-[400px] text-black opacity-50">
          <p>لا يوجد أي فواتير</p>
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-2">
          {filteredInvoicesSuppliers.map((invoice, i) => (
            <div dir="rtl" key={i}>
              <div className="bg-[var(--color-body)] p-6 rounded-xl shadow-md border-1">
                <p className="mb-3">
                  <span className="opacity-70 ml-2">تاريخ الفاتوة |</span>
                  <span>{invoice.date}</span>
                </p>
                <p className="mb-3">
                  <span className="opacity-70 ml-2">وقت الفاتوة |</span>
                  <span>{invoice.time}</span>
                </p>
                <p className="mb-3">
                  <span className="opacity-70 ml-2">المدينة |</span>
                  <span>{invoice.city}</span>
                  <span className="mx-1">-</span>
                  <span>{invoice.store}</span>
                </p>
                <p className="mb-3">
                  <span className="opacity-70 ml-2">إجمالي الفاتورة |</span>
                  <span className="font-bold">
                    {invoice.totalValuePurchase}
                  </span>
                  <span className="mr-1">دينار ليبي</span>
                </p>
                <p className="mb-3">
                  <span className="opacity-70 ml-2">تم دفع |</span>
                  <span className="font-bold text-green-700">
                    {invoice.paymentMoneyDetails.reduce(
                      (calc, alt) => calc + alt.valueMoney,
                      0
                    )}
                  </span>
                  <span className="mr-1 text-green-700">دينار ليبي</span>
                </p>
                <div className="flex justify-between items-center">
                  {invoice.paymentMoneyDetails.reduce(
                    (calc, alt) => calc + alt.valueMoney,
                    0
                  ) === invoice.totalValuePurchase ? (
                    <p
                      onClick={() =>
                        Alert("info", "تم دفع هذة الفاتورة بالكامل")
                      }
                      className="w-[100%] bg-blue-100 border-1 border-blue-400  rounded-3xl p-3 text-center text-blue-950 ml-2 flex items-center justify-center cursor-pointer"
                    >
                      <span>{Icons.BanknotesIcon}</span>
                      <span className="mb-1 mr-1">دفع</span>
                    </p>
                  ) : (
                    <ModelPayInvoice
                      idInvoice={invoice._id}
                      totalMoneyInvoice={invoice.totalValuePurchase}
                      payRecentMoney={invoice.paymentMoneyDetails.reduce(
                        (calc, alt) => calc + alt.valueMoney,
                        0
                      )}
                      Sucess={Sucess}
                    />
                  )}

                  <ModelShowProductsInInvoice products={invoice.productData} />
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
      dispatch(fetchInvoicesSupplier(invoiceId));
      isInitialLoad.current = false;
    }
  }, [dispatch]);

  useEffect(() => {
    if (invoicesSupplier) {
      setAllInvoices(invoicesSupplier);
    }
  }, [invoicesSupplier]);

  return (
    <div className="h-screen w-full bg-[var(--color-body)] border-1 border-[var(--color-navbar)] overflow-y-auto custom-scrollbar p-6 mt-1">
      {HeaderFilters()}

      <div dir="rtl">
        {loading ? (
          <div className="flex justify-center items-center h-[400px]">
            <Spinner size="lg" color="success" />
          </div>
        ) : (
          <TableInvoices />
        )}
      </div>
    </div>
  );
};

export default PageInvoicesSupplier;
