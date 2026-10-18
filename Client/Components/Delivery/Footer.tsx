import { Wallet, Newspaper, House, PackageOpen, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const path = usePathname();

  return (
    <footer className="bg-white border-1 shadow-lg fixed z-50 bottom-0 w-full p-4">
      <div className="flex justify-around">
        <Link
          className={`flex flex-col items-center ${
            path.startsWith("/delivery/orders")
              ? "text-[var(--color-matg3er)]"
              : "text-gray-600"
          }`}
          href={"/delivery/orders"}
        >
          <Newspaper strokeWidth={1.25} absoluteStrokeWidth />
          <span className="text-sm mt-1">الطلبيات</span>
        </Link>
        <Link
          className={`flex flex-col items-center ${
            path === "/delivery/wallet"
              ? "text-[var(--color-matg3er)]"
              : "text-gray-600"
          }`}
          href={"/delivery/wallet"}
        >
          <Wallet strokeWidth={1.25} absoluteStrokeWidth />
          <span className="text-sm mt-1">المحفظة</span>
        </Link>
        <Link
          className={`flex flex-col items-center  ${
            path === "/delivery"
              ? "text-[var(--color-matg3er)]"
              : "text-gray-600"
          }`}
          href={"/delivery"}
        >
          <House strokeWidth={1.25} absoluteStrokeWidth />
          <span className="text-sm mt-1">الرئيسية</span>
        </Link>
        <Link
          className={`flex flex-col items-center ${
            path === "/delivery/store"
              ? "text-[var(--color-matg3er)]"
              : "text-gray-600"
          }`}
          href={"/delivery/store"}
        >
          <PackageOpen strokeWidth={1.25} absoluteStrokeWidth />
          <span className="text-sm mt-1">مخزن الراجع</span>
        </Link>
        <Link
          className={`flex flex-col items-center ${
            path === "/delivery/settings"
              ? "text-[var(--color-matg3er)]"
              : "text-gray-600"
          }`}
          href={"/delivery/settings"}
        >
          <Settings strokeWidth={1.25} absoluteStrokeWidth />
          <span className="text-sm mt-1">الإعدادات</span>
        </Link>
      </div>
    </footer>
  );
}
