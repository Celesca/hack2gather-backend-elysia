/*
  Warnings:

  - A unique constraint covering the columns `[TeamID,UserID]` on the table `UserTeam` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `userteam` DROP FOREIGN KEY `UserTeam_TeamID_fkey`;

-- CreateIndex
CREATE UNIQUE INDEX `UserTeam_TeamID_UserID_key` ON `UserTeam`(`TeamID`, `UserID`);

-- AddForeignKey
ALTER TABLE `UserTeam` ADD CONSTRAINT `UserTeam_TeamID_fkey` FOREIGN KEY (`TeamID`) REFERENCES `Team`(`TeamID`) ON DELETE CASCADE ON UPDATE CASCADE;
