/*
  Warnings:

  - You are about to drop the column `currentMember` on the `team` table. All the data in the column will be lost.
  - You are about to drop the column `maxMember` on the `team` table. All the data in the column will be lost.
  - Added the required column `CurrentMember` to the `Team` table without a default value. This is not possible if the table is not empty.
  - Added the required column `MaxMember` to the `Team` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `team` DROP COLUMN `currentMember`,
    DROP COLUMN `maxMember`,
    ADD COLUMN `CurrentMember` INTEGER NOT NULL,
    ADD COLUMN `MaxMember` INTEGER NOT NULL;
