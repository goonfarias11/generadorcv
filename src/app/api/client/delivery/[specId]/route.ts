import fs from "fs";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getProductSpecById } from "@/services/productSpecService";

export const runtime = "nodejs";

interface RouteParams {
  params: Promise<{ specId: string }>;
}

export async function GET(_: Request, { params }: RouteParams) {
  const { specId } = await params;
  const store = await cookies();
  const customerId = store.get("customerId")?.value;

  if (!customerId) {
    return NextResponse.json({ status: "rejected" }, { status: 401 });
  }

  const spec = await getProductSpecById(specId);

  if (!spec || spec.customerId !== customerId || spec.status !== "delivered" || !spec.deliveryPath) {
    return NextResponse.json({ status: "rejected" }, { status: 404 });
  }

  if (!fs.existsSync(spec.deliveryPath)) {
    return NextResponse.json({ status: "rejected" }, { status: 404 });
  }

  const file = await fs.promises.readFile(spec.deliveryPath);

  return new NextResponse(file, {
    status: 200,
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename=${specId}.zip`,
    },
  });
}
