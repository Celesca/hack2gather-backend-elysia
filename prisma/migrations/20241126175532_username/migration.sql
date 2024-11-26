/*
  Warnings:

  - Added the required column `UserName` to the `UserTeam` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `userteam` ADD COLUMN `UserName` VARCHAR(191) NOT NULL;
