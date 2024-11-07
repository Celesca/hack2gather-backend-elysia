/*
  Warnings:

  - A unique constraint covering the columns `[Email]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `Email` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Password` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `User` ADD COLUMN `Bio` VARCHAR(191) NULL,
    ADD COLUMN `Email` VARCHAR(191) NOT NULL,
    ADD COLUMN `Password` VARCHAR(191) NOT NULL,
    ADD COLUMN `ProfileImage` VARCHAR(191) NULL,
    ADD COLUMN `WorkingStyle` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `User_Email_key` ON `User`(`Email`);
