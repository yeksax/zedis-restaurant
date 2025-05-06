/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `Category` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `Category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Category` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "MenuType" AS ENUM ('ENTREES', 'MAIN_COURSES', 'SEAFOOD', 'WINE', 'DESSERTS', 'COCKTAILS');

-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "description" TEXT,
ADD COLUMN     "displayOrder" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "image" TEXT,
ADD COLUMN     "slug" TEXT NOT NULL,
ADD COLUMN     "type" "MenuType" NOT NULL;

-- AlterTable
ALTER TABLE "MenuItem" ADD COLUMN     "allergens" TEXT,
ADD COLUMN     "baseSpirit" TEXT,
ADD COLUMN     "featured" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "glassType" TEXT,
ADD COLUMN     "glutenFree" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "ingredients" TEXT,
ADD COLUMN     "isSpicy" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isVegan" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isVegetarian" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "preparationTime" INTEGER,
ADD COLUMN     "wineGrapes" TEXT,
ADD COLUMN     "wineRegion" TEXT,
ADD COLUMN     "wineVintage" INTEGER;

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "estimatedDeliveryTime" TIMESTAMP(3),
ADD COLUMN     "specialInstructions" TEXT;

-- AlterTable
ALTER TABLE "Reservation" ADD COLUMN     "occasion" TEXT,
ADD COLUMN     "tablePreference" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");
