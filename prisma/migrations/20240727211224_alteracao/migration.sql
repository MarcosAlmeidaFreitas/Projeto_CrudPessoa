/*
  Warnings:

  - Added the required column `state` to the `Address` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Address" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "street" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "complement" TEXT NOT NULL,
    "CEP" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "personId" INTEGER NOT NULL,
    CONSTRAINT "Address_personId_fkey" FOREIGN KEY ("personId") REFERENCES "persons" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Address" ("CEP", "city", "complement", "country", "district", "id", "number", "personId", "street") SELECT "CEP", "city", "complement", "country", "district", "id", "number", "personId", "street" FROM "Address";
DROP TABLE "Address";
ALTER TABLE "new_Address" RENAME TO "Address";
CREATE UNIQUE INDEX "Address_personId_key" ON "Address"("personId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
