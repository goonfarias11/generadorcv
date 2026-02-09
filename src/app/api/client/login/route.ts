import { NextResponse } from "next/server";
import { getOrCreateCustomerByEmail } from "@/services/customerService";
import { createLoginTokenForCustomer } from "@/services/loginTokenService";

export async function POST(request: Request) {
  const payload = (await request.json().catch(() => null)) as { email?: string } | null;
  const email = payload?.email?.trim().toLowerCase();

  if (!email || !email.includes("@")) {
    return NextResponse.json(
      { status: "rejected", reason: "Email inválido." },
      { status: 400 }
    );
  }

  const customer = await getOrCreateCustomerByEmail(email);
  const { token } = await createLoginTokenForCustomer(customer.id);

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? request.headers.get("origin") ?? "";
  const magicLink = `${appUrl}/api/client/verify?token=${token}`;

  return NextResponse.json({ status: "accepted", magicLink });
}
