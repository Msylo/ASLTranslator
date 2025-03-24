/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `Session` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `post` ADD COLUMN `status` ENUM('NEW', 'DELETED', 'LOCKED') NOT NULL DEFAULT 'NEW';

-- AlterTable
ALTER TABLE `reply` ADD COLUMN `status` ENUM('NEW', 'DELETED', 'LOCKED') NOT NULL DEFAULT 'NEW';

-- CreateIndex
CREATE UNIQUE INDEX `Session_userId_key` ON `Session`(`userId`);
