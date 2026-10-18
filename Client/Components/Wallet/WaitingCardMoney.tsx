import Icons from "@/iconsSvg";

export default function WaitingCardMoney({ searchTerm, money }: {searchTerm : any ; money : number }) {
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
    <div className="p-7 border-2 border-dashed border-orange-300 bg-orange-50 rounded-lg text-center flex flex-col items-center space-y-3">
      <div className="text-yellow-700">
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
            d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
          />
        </svg>
      </div>
      <p className="text-yellow-700 text-xl flex items-center gap-x-2">
        <span>{Icons.BanknotesIcon}</span>
        <span>{highlightText("أموال في الإنتظار")}</span>
      </p>
      <span className="text-gray-600 text-lg">{money.toFixed(2)} د.ل</span>
    </div>
  );
}
