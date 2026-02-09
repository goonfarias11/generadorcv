-- CreateTable
CREATE TABLE "Plan" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "priceCents" INTEGER NOT NULL,
    "interval" TEXT NOT NULL,
    "features" JSONB,
    "stripeProductId" TEXT,
    "stripePriceId" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "specId" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "stripeSubscriptionId" TEXT,
    "stripeCheckoutSessionId" TEXT,
    "status" TEXT NOT NULL,
    "currentPeriodEnd" DATETIME,
    "cancelAtPeriodEnd" BOOLEAN NOT NULL DEFAULT false,
    "partnerShareCents" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Subscription_specId_fkey" FOREIGN KEY ("specId") REFERENCES "ProductSpec" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Subscription_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
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
    "customerId" TEXT,
    "planId" TEXT,
    "planStatus" TEXT,
    "planExpiresAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ProductSpec_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "ProductSpec_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "ProductSpec_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "Partner" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_ProductSpec" ("complexity", "copyTone", "createdAt", "customerId", "deliveryPath", "deliveryTime", "deployStatus", "deployUrl", "deployedAt", "designSystem", "id", "industry", "mode", "objective", "partnerId", "priceEstimate", "productType", "sections", "status") SELECT "complexity", "copyTone", "createdAt", "customerId", "deliveryPath", "deliveryTime", "deployStatus", "deployUrl", "deployedAt", "designSystem", "id", "industry", "mode", "objective", "partnerId", "priceEstimate", "productType", "sections", "status" FROM "ProductSpec";
DROP TABLE "ProductSpec";
ALTER TABLE "new_ProductSpec" RENAME TO "ProductSpec";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Plan_slug_key" ON "Plan"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_specId_key" ON "Subscription"("specId");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_stripeSubscriptionId_key" ON "Subscription"("stripeSubscriptionId");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_stripeCheckoutSessionId_key" ON "Subscription"("stripeCheckoutSessionId");
