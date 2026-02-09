import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { requireAgencyRole } from "@/services/agencyService";
import { listAgencyLogs } from "@/services/agencyAuditService";

interface RouteParams {
  params: { id: string };
}

export async function GET(request: Request, { params }: RouteParams) {
  const store = await cookies();
  const customerId = store.get("customerId")?.value;
  if (!customerId) {
    return NextResponse.json({ status: "rejected" }, { status: 401 });
  }

  try {
    await requireAgencyRole({
      agencyId: params.id,
      userId: customerId,
      roles: ["owner", "admin", "editor", "viewer"],
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Permisos insuficientes";
    return NextResponse.json({ status: "rejected", reason: message }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const limit = searchParams.get("limit");
  const logs = await listAgencyLogs(params.id, limit ? Number(limit) : 100);
  return NextResponse.json({ status: "accepted", logs });
}
