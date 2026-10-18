// app/api/session/route.ts
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET() {
  const token = cookies().get("session")?.value;
  const secret = process.env.NEXT_PUBLIC_KEY_HASH!;

  if (!token) return NextResponse.json({ user: null });

  try {
    const decoded = jwt.verify(token, secret);
    return NextResponse.json({ user: decoded });
  } catch {
    return NextResponse.json({ user: null });
  }
}
