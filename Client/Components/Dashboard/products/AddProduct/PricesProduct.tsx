import React from "react";

interface PricesProps {
  productData: {
    price: number;
    priceMarkter: number;
    gainMarkter: number;
    priceCustomer: number;
  };
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
}

export default function Prices({ productData, onChange }: PricesProps) {
  return (
    <>
      <div className="px-4 py-5 border-1 border-y-0 border-dashed border-slate-400 flex">
        <div className="flex flex-col ml-2 w-[100%]">
          <label htmlFor="price" className="text-gray-700 mb-2 mr-2 opacity-55">
            تكلفة المنتج
          </label>
          <div className="flex items-center">
            <input
              className="input"
              type="number"
              id="price"
              name="price"
              value={productData.price}
              onChange={onChange}
              required
            />
          </div>
        </div>
        <div className="w-[100%] ml-2">
          <div className="flex flex-col  w-[100%]">
            <label
              htmlFor="priceMarkter"
              className="text-gray-700 mb-2 mr-2 opacity-55"
            >
              سعر البيع للمسوق
            </label>
            <input
              className="input"
              type="number"
              id="priceMarkter"
              name="priceMarkter"
              value={productData.priceMarkter}
              onChange={onChange}
              required
            />
          </div>
          <div className="mt-2 w-[100%] flex flex-col items-center">
            <label
              htmlFor="gainMarkter"
              className="text-gray-700 mb-2 opacity-55"
            >
              ربح المسوق
            </label>
            <input
              className="input"
              type="number"
              id="gainMarkter"
              name="gainMarkter"
              value={productData.gainMarkter}
              onChange={onChange}
              required
            />
          </div>
        </div>
        <div className="flex flex-col ml-2 w-[100%]">
          <label
            htmlFor="priceCustomer"
            className="text-gray-700 mb-2 mr-2 opacity-55"
          >
            سعر البيع للزبون
          </label>
          <input
            className="input"
            type="number"
            id="priceCustomer"
            name="priceCustomer"
            value={productData.priceCustomer}
            onChange={onChange}
            required
          />
        </div>
      </div>
    </>
  );
}
