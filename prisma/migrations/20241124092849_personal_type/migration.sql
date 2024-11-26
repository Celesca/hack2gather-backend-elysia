/*
  Warnings:

  - You are about to drop the `personal` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `userpersonal` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `userpersonal` DROP FOREIGN KEY `UserPersonal_PersonalID_fkey`;

-- DropForeignKey
ALTER TABLE `userpersonal` DROP FOREIGN KEY `UserPersonal_UserID_fkey`;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `PersonalTypeID` INTEGER NULL;

-- DropTable
DROP TABLE `personal`;

-- DropTable
DROP TABLE `userpersonal`;

-- CreateTable
CREATE TABLE `PersonalType` (
    `PersonalTypeID` INTEGER NOT NULL AUTO_INCREMENT,
    `PersonalType` VARCHAR(191) NOT NULL,
    `PersonalTypeDetail` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`PersonalTypeID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_PersonalTypeID_fkey` FOREIGN KEY (`PersonalTypeID`) REFERENCES `PersonalType`(`PersonalTypeID`) ON DELETE SET NULL ON UPDATE CASCADE;
