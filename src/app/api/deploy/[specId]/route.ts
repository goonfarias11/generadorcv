import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getProductSpecById, updateProductSpecDeploy } from "@/services/productSpecService";
import { deployToVercel } from "@/modules/deploy/vercelDeploy.service";
import { isSpecPlanActive } from "@/services/subscriptionService";

interface RouteParams {
  params: { specId: string };
}

export async function POST(_: Request, { params }: RouteParams) {
  const store = await cookies();
  const customerId = store.get("customerId")?.value;

  if (!customerId) {
    return NextResponse.json({ status: "rejected" }, { status: 401 });
  }

  const spec = await getProductSpecById(params.specId);

  if (!spec || spec.customerId !== customerId) {
    return NextResponse.json({ status: "rejected", reason: "Spec no encontrada" }, { status: 404 });
  }

  if (spec.status !== "delivered") {
    return NextResponse.json(
      { status: "rejected", reason: "La entrega aún no está disponible." },
      { status: 400 }
    );
  }

  if (!isSpecPlanActive(spec)) {
    return NextResponse.json(
      { status: "rejected", reason: "Plan mensual inactivo." },
      { status: 403 }
    );
  }

  try {
    await updateProductSpecDeploy({
      id: spec.id,
      deployStatus: "pending",
      deployUrl: null,
      deployedAt: null,
    });

    const deployment = await deployToVercel(spec);

    await updateProductSpecDeploy({
      id: spec.id,
      deployStatus: "deployed",
      deployUrl: deployment.url,
      deployedAt: new Date(),
    });

    return NextResponse.json({ status: "accepted", url: deployment.url });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Deploy fallido";
    await updateProductSpecDeploy({
      id: spec.id,
      deployStatus: "failed",
      deployUrl: null,
      deployedAt: null,
    });
    return NextResponse.json({ status: "rejected", reason: message }, { status: 400 });
  }
}
