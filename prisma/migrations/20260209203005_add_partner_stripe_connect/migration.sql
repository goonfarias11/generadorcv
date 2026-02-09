-- AlterTable
ALTER TABLE "PartnerPayout" ADD COLUMN "errorMessage" TEXT;
ALTER TABLE "PartnerPayout" ADD COLUMN "paymentId" TEXT;
ALTER TABLE "PartnerPayout" ADD COLUMN "transferId" TEXT;
ALTER TABLE "PartnerPayout" ADD COLUMN "transferStatus" TEXT;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Partner" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "logoUrl" TEXT,
    "primaryColor" TEXT,
    "commissionPct" INTEGER NOT NULL DEFAULT 30,
    "balanceCents" INTEGER NOT NULL DEFAULT 0,
    "stripeAccountId" TEXT,
    "payoutsEnabled" BOOLEAN NOT NULL DEFAULT false,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Partner" ("active", "balanceCents", "commissionPct", "createdAt", "id", "logoUrl", "name", "primaryColor", "slug") SELECT "active", "balanceCents", "commissionPct", "createdAt", "id", "logoUrl", "name", "primaryColor", "slug" FROM "Partner";
DROP TABLE "Partner";
ALTER TABLE "new_Partner" RENAME TO "Partner";
CREATE UNIQUE INDEX "Partner_slug_key" ON "Partner"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
