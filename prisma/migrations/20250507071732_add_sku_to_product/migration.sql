/*
  Warnings:

  - You are about to drop the column `colorId` on the `productcolor` table. All the data in the column will be lost.
  - You are about to drop the column `sizeId` on the `productsize` table. All the data in the column will be lost.
  - You are about to drop the `color` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `size` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[sku]` on the table `Product` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `hex` to the `ProductColor` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `ProductColor_colorId_idx` ON `productcolor`;

-- DropIndex
DROP INDEX `ProductSize_sizeId_idx` ON `productsize`;

-- AlterTable
ALTER TABLE `product` ADD COLUMN `sku` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `productcolor` DROP COLUMN `colorId`,
    ADD COLUMN `hex` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `productsize` DROP COLUMN `sizeId`;

-- DropTable
DROP TABLE `color`;

-- DropTable
DROP TABLE `size`;

-- CreateIndex
CREATE UNIQUE INDEX `Product_sku_key` ON `Product`(`sku`);
