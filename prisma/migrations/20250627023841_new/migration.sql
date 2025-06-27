/*
  Warnings:

  - You are about to drop the column `email` on the `customerinfo` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `customerinfo` DROP COLUMN `email`;

-- CreateTable
CREATE TABLE `FakeComment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `productId` INTEGER NOT NULL,
    `content` TEXT NOT NULL,
    `ratingCount` INTEGER NOT NULL,
    `authorName` VARCHAR(191) NOT NULL,
    `avatarUrl` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `FakeComment_productId_idx`(`productId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
