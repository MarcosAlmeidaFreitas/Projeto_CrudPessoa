/*
  Warnings:

  - You are about to drop the column `addressId` on the `persons` table. All the data in the column will be lost.
  - Added the required column `country` to the `Address` table without a default value. This is not possible if the table is not empty.

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
    "country" TEXT NOT NULL,
    "personId" INTEGER NOT NULL,
    CONSTRAINT "Address_personId_fkey" FOREIGN KEY ("personId") REFERENCES "persons" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Address" ("CEP", "city", "complement", "district", "id", "number", "personId", "street") SELECT "CEP", "city", "complement", "district", "id", "number", "personId", "street" FROM "Address";
DROP TABLE "Address";
ALTER TABLE "new_Address" RENAME TO "Address";
CREATE UNIQUE INDEX "Address_personId_key" ON "Address"("personId");
CREATE TABLE "new_persons" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "image" TEXT,
    "dateBirth" DATETIME NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_persons" ("cpf", "created_at", "dateBirth", "email", "id", "image", "name", "phone") SELECT "cpf", "created_at", "dateBirth", "email", "id", "image", "name", "phone" FROM "persons";
DROP TABLE "persons";
ALTER TABLE "new_persons" RENAME TO "persons";
CREATE UNIQUE INDEX "persons_cpf_key" ON "persons"("cpf");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
