/*
  Warnings:

  - Added the required column `addOnAmount` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `baseAmount` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "AddOn" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "priceCents" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "_SpecAddOns" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_SpecAddOns_A_fkey" FOREIGN KEY ("A") REFERENCES "AddOn" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_SpecAddOns_B_fkey" FOREIGN KEY ("B") REFERENCES "ProductSpec" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Payment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "specId" TEXT NOT NULL,
    "stripeSession" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "baseAmount" INTEGER NOT NULL,
    "addOnAmount" INTEGER NOT NULL,
    "addOnIds" JSONB,
    "currency" TEXT NOT NULL DEFAULT 'usd',
    "status" TEXT NOT NULL DEFAULT 'pending',
    "email" TEXT,
    "partnerId" TEXT,
    "partnerShare" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Payment_specId_fkey" FOREIGN KEY ("specId") REFERENCES "ProductSpec" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Payment_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "Partner" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Payment" ("amount", "createdAt", "currency", "email", "id", "partnerId", "partnerShare", "specId", "status", "stripeSession") SELECT "amount", "createdAt", "currency", "email", "id", "partnerId", "partnerShare", "specId", "status", "stripeSession" FROM "Payment";
DROP TABLE "Payment";
ALTER TABLE "new_Payment" RENAME TO "Payment";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "AddOn_slug_key" ON "AddOn"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "_SpecAddOns_AB_unique" ON "_SpecAddOns"("A", "B");

-- CreateIndex
CREATE INDEX "_SpecAddOns_B_index" ON "_SpecAddOns"("B");
