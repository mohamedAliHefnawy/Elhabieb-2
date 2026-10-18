import { type NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { SessionData } from "./contexts/SessionContext";

export default async function middleware(request: NextRequest) {
  const pathName = request.nextUrl.pathname;
  const token = request.cookies.get("session")?.value;
  const authRoutes = ["/auth/signin", "/auth/signup"];

  const protectedPages = [
    "/Profile",
    "/cart",
    "/fav",
    "/orders",
    "/wallet",
    "/delivery",
    "/dashboard",
    "/pos",
  ];

  const isAuthRoute = authRoutes.some((route) => pathName.startsWith(route));
  const isProtectedRoute = protectedPages.some((route) =>
    pathName.startsWith(route)
  );

  if (!token && isProtectedRoute) {
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  }

  if (token) {
    const decodedData = jwt.decode(token) as SessionData;

    if (decodedData.validity === "Admin") {
      if (!pathName.startsWith("/dashboard")) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    } else if (decodedData.validity === "Employ") {
      if (!pathName.startsWith("/dashboard")) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    } else if (decodedData.validity === "Markter") {
      if (
        pathName.startsWith("/delivery") ||
        pathName.startsWith("/dashboard") ||
        pathName.startsWith("/pos")
      ) {
        return NextResponse.redirect(new URL("/", request.url));
      }
    } else if (decodedData.validity === "Client") {
      if (
        pathName.startsWith("/delivery") ||
        pathName.startsWith("/dashboard") ||
        pathName.startsWith("/pos")
      ) {
        return NextResponse.redirect(new URL("/", request.url));
      }
    } else if (decodedData.validity === "Delivery") {
      if (!pathName.startsWith("/delivery")) {
        return NextResponse.redirect(new URL("/delivery", request.url));
      }
    } else if (decodedData.validity === "Pos") {
      if (!pathName.startsWith("/pos")) {
        return NextResponse.redirect(new URL("/pos", request.url));
      }
    }

    if (isAuthRoute) {
      if (
        decodedData.validity === "Employ" ||
        decodedData.validity === "Admin"
      ) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      } else if (
        decodedData.validity === "Markter" ||
        decodedData.validity === "Client"
      ) {
        return NextResponse.redirect(new URL("/", request.url));
      } else if (decodedData.validity === "Delivery") {
        return NextResponse.redirect(new URL("/delivery", request.url));
      } else if (decodedData.validity === "Pos") {
        return NextResponse.redirect(new URL("/pos", request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/Profile",
    "/cart",
    "/fav",
    "/orders",
    "/wallet",
    // "/auth/:path*",
    "/delivery/:path*",
    "/dashboard/:path*",
    "/pos/:path*",
  ],
};
