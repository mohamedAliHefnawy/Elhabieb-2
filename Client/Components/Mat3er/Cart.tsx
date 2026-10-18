import Icons from "@/iconsSvg";
import Link from "next/link";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/src/store";
import {
  fetchProductsInCartUser,
  selectTotalProductsInCart,
} from "@/features/cartSlice";
import { useEffect, useRef, useState } from "react";

import getSessionData, { SessionData } from "@/contexts/SessionContext";
import { ShoppingCart } from "lucide-react";
import useSessionData from "@/hooks/useSessionData";

export default function Cart() {
  const dispatch = useDispatch<AppDispatch>();
  const isInitialLoad = useRef(true);
  const sessionData = useSessionData();
  const { items } = useSelector((state: RootState) => state.cart);

  const totalProducts = useSelector(selectTotalProductsInCart);
  const [animationClass, setAnimationClass] = useState("");

  useEffect(() => {
    if (isInitialLoad.current && sessionData?.email) {
      dispatch(fetchProductsInCartUser(sessionData?.email as string));
      isInitialLoad.current = false;
    }
  }, [dispatch, sessionData?.email, items.length]);

  useEffect(() => {
    setAnimationClass("slide-up");
    const timer = setTimeout(() => {
      setAnimationClass("");
    }, 500);

    return () => clearTimeout(timer);
  }, [totalProducts]);

  return (
    <div className="fixed z-50 bottom-12 right-0">
      <p
        className={`absolute z-50 bottom-0 right-0 mr-5 mb-3 bg-[var(--color-matg3er)] rounded-full flex justify-center items-center text-white w-6 h-6 ${animationClass}`}
      >
        {totalProducts}
      </p>

      <Link
        color="foreground"
        href="/cart"
        className="absolute z-40 bottom-0 right-0 mr-6 mb-4 bg-white rounded-full flex justify-center items-center border-2 border-[var(--color-matg3er)] p-7 w-10 h-10"
      >
        <span className="text-[var(--color-matg3er)]">
          <ShoppingCart size={28} strokeWidth={1} />
        </span>
      </Link>
    </div>
  );
}
