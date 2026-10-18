"use client";

import React from "react";

const ErrorDev = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="max-w-md w-full bg-white shadow-md rounded-lg p-6">
        <div className="flex items-center justify-center mb-4">
          <svg
            className="w-16 h-16 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m-4 4h8m4 4H4a12 12 0 010-24h16a12 12 0 010 24z"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-4">
          توجد مشكلة ما !!!
        </h2>
        <p className="text-gray-600 text-center mb-6">
          نأسف لحدوث هذا الخطأ. يرجى المحاولة مرة أخرى لاحقًا أو الاتصال بالدعم.
        </p>
        <div className="flex justify-center">
          <button
            className="px-4 py-2 bg-red-500 text-white font-semibold rounded-md shadow hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75"
            onClick={() => window.location.reload()}
          >
            إعادة تحميل الصفحة
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorDev;
