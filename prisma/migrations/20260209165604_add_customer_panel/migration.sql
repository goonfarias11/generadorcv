-- CreateTable
CREATE TABLE "Customer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "LoginToken" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "token" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    "usedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "LoginToken_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
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
    "customerId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Payment_specId_fkey" FOREIGN KEY ("specId") REFERENCES "ProductSpec" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Payment_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "Partner" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Payment_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Payment" ("addOnAmount", "addOnIds", "amount", "baseAmount", "createdAt", "currency", "email", "id", "partnerId", "partnerShare", "specId", "status", "stripeSession") SELECT "addOnAmount", "addOnIds", "amount", "baseAmount", "createdAt", "currency", "email", "id", "partnerId", "partnerShare", "specId", "status", "stripeSession" FROM "Payment";
DROP TABLE "Payment";
ALTER TABLE "new_Payment" RENAME TO "Payment";
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
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ProductSpec_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "ProductSpec_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "Partner" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_ProductSpec" ("complexity", "copyTone", "createdAt", "deliveryPath", "deliveryTime", "deployStatus", "deployUrl", "deployedAt", "designSystem", "id", "industry", "mode", "objective", "partnerId", "priceEstimate", "productType", "sections", "status") SELECT "complexity", "copyTone", "createdAt", "deliveryPath", "deliveryTime", "deployStatus", "deployUrl", "deployedAt", "designSystem", "id", "industry", "mode", "objective", "partnerId", "priceEstimate", "productType", "sections", "status" FROM "ProductSpec";
DROP TABLE "ProductSpec";
ALTER TABLE "new_ProductSpec" RENAME TO "ProductSpec";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Customer_email_key" ON "Customer"("email");

-- CreateIndex
CREATE UNIQUE INDEX "LoginToken_token_key" ON "LoginToken"("token");
