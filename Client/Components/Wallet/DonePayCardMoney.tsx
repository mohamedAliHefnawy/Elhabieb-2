import Icons from "@/iconsSvg";

export default function DonePayCardMoney({ searchTerm, money }: {searchTerm : any ; money : number }) {
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
    <div className="p-7 border-2 border-double border-blue-300 bg-blue-50 rounded-lg text-center flex flex-col items-center space-y-3">
      <div className="text-blue-700">
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
            d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z"
          />
        </svg>
      </div>
      <p className="text-blue-700 text-xl flex items-center gap-x-2">
        <span>{Icons.BanknotesIcon}</span>
        <span>{highlightText("أموال تم سحبها")}</span>
      </p>
      <span className="text-gray-600 text-lg">{money.toFixed(2)} د.ل</span>
    </div>
  );
}
