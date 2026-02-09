import { NextResponse } from "next/server";
import { verifyLoginToken } from "@/services/loginTokenService";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const token = url.searchParams.get("token");

  if (!token) {
    return NextResponse.json({ status: "rejected" }, { status: 400 });
  }

  const customerId = await verifyLoginToken(token);
  if (!customerId) {
    return NextResponse.json({ status: "rejected" }, { status: 400 });
  }

  const response = NextResponse.redirect(new URL("/client", request.url));
  response.cookies.set({
    name: "customerId",
    value: customerId,
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });

  return response;
}
