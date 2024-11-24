/*
  Warnings:

  - You are about to drop the column `Personal_type` on the `personal` table. All the data in the column will be lost.
  - You are about to drop the column `Personal_type_detail` on the `personal` table. All the data in the column will be lost.
  - Added the required column `PersonalType` to the `Personal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `PersonalType_detail` to the `Personal` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `personal` DROP COLUMN `Personal_type`,
    DROP COLUMN `Personal_type_detail`,
    ADD COLUMN `PersonalType` VARCHAR(191) NOT NULL,
    ADD COLUMN `PersonalType_detail` VARCHAR(191) NOT NULL,
    MODIFY `PersonalID` INTEGER NOT NULL;
