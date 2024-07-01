/*
  Warnings:

  - You are about to drop the column `clientEmail` on the `services` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `services` DROP FOREIGN KEY `Services_clientEmail_fkey`;

-- AlterTable
ALTER TABLE `services` DROP COLUMN `clientEmail`,
    ADD COLUMN `clientid` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Services` ADD CONSTRAINT `Services_clientid_fkey` FOREIGN KEY (`clientid`) REFERENCES `Client`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
