/*
  Warnings:

  - Added the required column `currentMember` to the `Team` table without a default value. This is not possible if the table is not empty.
  - Added the required column `maxMember` to the `Team` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `team` ADD COLUMN `currentMember` INTEGER NOT NULL,
    ADD COLUMN `maxMember` INTEGER NOT NULL;
