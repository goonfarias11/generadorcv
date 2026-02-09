const fs = require("fs");
const path = require("path");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const issues = [];
  const isMissingTable = (error) =>
    error && typeof error === "object" && error.code === "P2021";

  const deliveredSpecs = await prisma.productSpec.findMany({
    where: {
      status: "delivered",
      OR: [{ deliveryPath: null }, { deliveryPath: "" }],
    },
    select: { id: true, deliveryPath: true },
  });

  for (const spec of deliveredSpecs) {
    issues.push({
      type: "delivery",
      message: `Spec ${spec.id} marcada como delivered sin deliveryPath.`,
    });
  }

  const deliveredWithPath = await prisma.productSpec.findMany({
    where: { status: "delivered", deliveryPath: { not: null } },
    select: { id: true, deliveryPath: true },
  });

  for (const spec of deliveredWithPath) {
    if (!spec.deliveryPath) continue;
    const absolute = path.isAbsolute(spec.deliveryPath)
      ? spec.deliveryPath
      : path.resolve(process.cwd(), spec.deliveryPath);
    if (!fs.existsSync(absolute)) {
      issues.push({
        type: "delivery",
        message: `Spec ${spec.id} tiene deliveryPath inexistente: ${spec.deliveryPath}.`,
      });
    }
  }

  const deployedSpecs = await prisma.productSpec.findMany({
    where: {
      deployStatus: "deployed",
      OR: [{ deployUrl: null }, { deployUrl: "" }],
    },
    select: { id: true },
  });

  for (const spec of deployedSpecs) {
    issues.push({
      type: "deploy",
      message: `Spec ${spec.id} con deployStatus=deployed sin deployUrl.`,
    });
  }

  const activePlans = await prisma.productSpec.findMany({
    where: { planStatus: "active" },
    select: { id: true, planExpiresAt: true },
  });

  for (const spec of activePlans) {
    if (!spec.planExpiresAt) {
      issues.push({
        type: "plan",
        message: `Spec ${spec.id} con plan activo sin planExpiresAt.`,
      });
    }
  }

  if (prisma.subscription?.findMany) {
    try {
      const subscriptions = await prisma.subscription.findMany({
        include: { spec: true },
      });

      for (const subscription of subscriptions) {
        if (
          subscription.spec?.partnerId &&
          (!subscription.partnerShareCents || subscription.partnerShareCents <= 0)
        ) {
          issues.push({
            type: "subscription",
            message: `Suscripcion ${subscription.id} sin partnerShareCents para partner ${subscription.spec.partnerId}.`,
          });
        }
      }
    } catch (error) {
      if (isMissingTable(error)) {
        issues.push({
          type: "subscription",
          message: "Tabla Subscription no existe. Ejecuta prisma migrate dev.",
        });
      } else {
        throw error;
      }
    }
  } else {
    issues.push({
      type: "subscription",
      message: "Modelo Subscription no disponible en Prisma client. Ejecuta prisma generate.",
    });
  }

  if (prisma.payment?.findMany) {
    try {
      const payments = await prisma.payment.findMany({
        where: { partnerId: { not: null } },
        select: { id: true, partnerId: true, partnerShare: true },
      });

      for (const payment of payments) {
        if (!payment.partnerShare || payment.partnerShare <= 0) {
          issues.push({
            type: "payment",
            message: `Pago ${payment.id} sin partnerShare para partner ${payment.partnerId}.`,
          });
        }
      }
    } catch (error) {
      if (isMissingTable(error)) {
        issues.push({
          type: "payment",
          message: "Tabla Payment no existe. Ejecuta prisma migrate dev.",
        });
      } else {
        throw error;
      }
    }
  } else {
    issues.push({
      type: "payment",
      message: "Modelo Payment no disponible en Prisma client. Ejecuta prisma generate.",
    });
  }

  if (prisma.agencyBilling?.findMany) {
    try {
      const billings = await prisma.agencyBilling.findMany({
        where: { stripeSubscriptionId: { not: null } },
        select: { id: true, agencyId: true, currentPeriodEnd: true, status: true },
      });

      for (const billing of billings) {
        if (!billing.currentPeriodEnd) {
          issues.push({
            type: "agency-billing",
            message: `Billing ${billing.id} sin currentPeriodEnd (agency ${billing.agencyId}).`,
          });
        }
        if (!billing.status) {
          issues.push({
            type: "agency-billing",
            message: `Billing ${billing.id} sin status (agency ${billing.agencyId}).`,
          });
        }
      }
    } catch (error) {
      if (isMissingTable(error)) {
        issues.push({
          type: "agency-billing",
          message: "Tabla AgencyBilling no existe. Ejecuta prisma migrate dev.",
        });
      } else {
        throw error;
      }
    }
  } else {
    issues.push({
      type: "agency-billing",
      message: "Modelo AgencyBilling no disponible en Prisma client. Ejecuta prisma generate.",
    });
  }

  if (issues.length === 0) {
    console.log("OK: No se encontraron inconsistencias.");
    return;
  }

  console.log(`Encontradas ${issues.length} inconsistencias:`);
  for (const issue of issues) {
    console.log(`- [${issue.type}] ${issue.message}`);
  }

  process.exitCode = 1;
}

main()
  .catch((error) => {
    console.error("Error al ejecutar verificacion:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
