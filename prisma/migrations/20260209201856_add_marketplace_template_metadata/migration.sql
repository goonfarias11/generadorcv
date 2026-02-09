-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Template" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "baseSpec" JSONB NOT NULL,
    "priceUSD" INTEGER NOT NULL,
    "tier" TEXT NOT NULL,
    "coverImage" TEXT,
    "shortTagline" TEXT NOT NULL DEFAULT 'Template listo para lanzar',
    "useCases" JSONB,
    "popularity" INTEGER NOT NULL DEFAULT 0,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "partnerSlug" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Template_partnerSlug_fkey" FOREIGN KEY ("partnerSlug") REFERENCES "Partner" ("slug") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Template" ("baseSpec", "category", "createdAt", "description", "id", "isActive", "name", "partnerSlug", "priceUSD", "slug", "tier") SELECT "baseSpec", "category", "createdAt", "description", "id", "isActive", "name", "partnerSlug", "priceUSD", "slug", "tier" FROM "Template";
DROP TABLE "Template";
ALTER TABLE "new_Template" RENAME TO "Template";
CREATE UNIQUE INDEX "Template_slug_key" ON "Template"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
