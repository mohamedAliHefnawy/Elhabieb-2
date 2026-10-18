import Icons from "@/iconsSvg";

export default function FailedCardMoney({
  searchTerm,
  money,
}: {
  searchTerm: any;
  money: number;
}) {
  const highlightText = (text: string) => {
    if (!searchTerm) return text;
    const regex = new RegExp(`(${searchTerm})`, "gi");
    const parts = text.split(regex);
    return parts.map((part, index) =>
      regex.test(part) ? (
        <span key={index} className="font-bold text-gray-900 underline">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <div className="p-7 border-2 border-dashed border-red-300 bg-red-50 rounded-lg text-center flex flex-col items-center space-y-3">
      <div className="text-red-700">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-12 h-12"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m6 4.125 2.25 2.25m0 0 2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"
          />
        </svg>
      </div>
      <p className="text-red-700 text-xl flex items-center gap-x-2">
        <span>{Icons.BanknotesIcon}</span>
        <span>{highlightText("أموال تم رفضها")}</span>
      </p>
      <span className="text-gray-600 text-lg">{money.toFixed(2)} د.ل</span>
    </div>
  );
}
