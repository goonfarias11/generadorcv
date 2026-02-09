-- CreateTable
CREATE TABLE "ProductSpec" (
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
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
