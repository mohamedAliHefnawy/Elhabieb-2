"use client";

import { Cairo } from "next/font/google";
import { NextUIProvider } from "@nextui-org/react";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { Provider } from "react-redux";
import { AppDispatch, RootState, store } from "@/src/store";
import "../app/globals.css";
import { AuthContextProvider } from "./auth/AuthWithGoogle";
import { ReactNode, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Cart from "@/Components/Mat3er/Cart";
import ButtonScroll from "@/Components/Mat3er/ButtonScroll";

const cairo = Cairo({ subsets: ["arabic"] });

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  const path = usePathname();
  return (
    <html lang="ar" className={cairo.className}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          rel="stylesheet"
          href="https://unpkg.com/boxicons@2.0.7/css/boxicons.min.css"
        />
      </head>
      <body className="scrollDashbordSideBar">
        <Provider store={store}>
          <NextUIProvider>
            <NextThemesProvider attribute="light" defaultTheme="light">
              <SessionProvider>
                <AuthContextProvider>
                  {children}
                  {!path.startsWith("/dashboard") &&
                    !path.startsWith("/delivery") &&
                    !path.startsWith("/pos") &&
                    !path.startsWith("/auth") && <ButtonScroll />}

                  {!path.startsWith("/dashboard") &&
                    !path.startsWith("/delivery") &&
                    !path.startsWith("/pos") &&
                    !path.startsWith("/auth") && <Cart />}

                </AuthContextProvider>
              </SessionProvider>
            </NextThemesProvider>
          </NextUIProvider>
        </Provider>
      </body>
    </html>
  );
}
