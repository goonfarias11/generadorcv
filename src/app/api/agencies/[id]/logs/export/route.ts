import { NextResponse } from "next/server";
import { exportAgencyLogsCsv } from "@/services/agencyAuditService";

interface RouteParams {
  params: { id: string };
}

export async function GET(_: Request, { params }: RouteParams) {
  const csv = await exportAgencyLogsCsv(params.id);
  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename=agency-${params.id}-logs.csv`,
    },
  });
}
