/*
  Warnings:

  - You are about to drop the column `PersonalType_detail` on the `personal` table. All the data in the column will be lost.
  - Added the required column `PersonalTypeDetail` to the `Personal` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `personal` DROP COLUMN `PersonalType_detail`,
    ADD COLUMN `PersonalTypeDetail` VARCHAR(191) NOT NULL;
