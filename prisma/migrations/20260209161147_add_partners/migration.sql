-- CreateTable
CREATE TABLE "Partner" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "logoUrl" TEXT,
    "primaryColor" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ProductSpec" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "mode" TEXT NOT NULL,
    "productType" TEXT NOT NULL,
    "objective" TEXT NOT NULL,
    "industry" TEXT,
    "sections" JSONB NOT NULL,
    "designSystem" TEXT NOT NULL,
    "copyTone" TEXT NOT NULL,
    "complexity" TEXT NOT NULL,
    "deliveryTime" TEXT NOT NULL,
    "priceEstimate" REAL NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'generated',
    "deliveryPath" TEXT,
    "deployStatus" TEXT,
    "deployUrl" TEXT,
    "deployedAt" DATETIME,
    "partnerId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ProductSpec_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "Partner" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_ProductSpec" ("complexity", "copyTone", "createdAt", "deliveryPath", "deliveryTime", "deployStatus", "deployUrl", "deployedAt", "designSystem", "id", "industry", "mode", "objective", "priceEstimate", "productType", "sections", "status") SELECT "complexity", "copyTone", "createdAt", "deliveryPath", "deliveryTime", "deployStatus", "deployUrl", "deployedAt", "designSystem", "id", "industry", "mode", "objective", "priceEstimate", "productType", "sections", "status" FROM "ProductSpec";
DROP TABLE "ProductSpec";
ALTER TABLE "new_ProductSpec" RENAME TO "ProductSpec";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Partner_slug_key" ON "Partner"("slug");
