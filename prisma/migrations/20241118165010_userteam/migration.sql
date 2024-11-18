/*
  Warnings:

  - You are about to drop the `_TeamMembers` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_TeamMembers` DROP FOREIGN KEY `_TeamMembers_A_fkey`;

-- DropForeignKey
ALTER TABLE `_TeamMembers` DROP FOREIGN KEY `_TeamMembers_B_fkey`;

-- DropTable
DROP TABLE `_TeamMembers`;

-- CreateTable
CREATE TABLE `UserTeam` (
    `UserTeamID` INTEGER NOT NULL AUTO_INCREMENT,
    `UserID` VARCHAR(191) NOT NULL,
    `TeamID` INTEGER NOT NULL,
    `Role` VARCHAR(191) NOT NULL,
    `JoinedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`UserTeamID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `UserTeam` ADD CONSTRAINT `UserTeam_UserID_fkey` FOREIGN KEY (`UserID`) REFERENCES `User`(`UserID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserTeam` ADD CONSTRAINT `UserTeam_TeamID_fkey` FOREIGN KEY (`TeamID`) REFERENCES `Team`(`TeamID`) ON DELETE RESTRICT ON UPDATE CASCADE;
