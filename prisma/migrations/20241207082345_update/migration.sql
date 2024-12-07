/*
  Warnings:

  - A unique constraint covering the columns `[TeamID,UserID]` on the table `UserTeam` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `UserTeam_TeamID_UserID_key` ON `UserTeam`(`TeamID`, `UserID`);
