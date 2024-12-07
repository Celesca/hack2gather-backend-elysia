/*
  Warnings:

  - A unique constraint covering the columns `[RatedByID,RatedUserID]` on the table `UserRating` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `UserRating_RatedByID_RatedUserID_key` ON `UserRating`(`RatedByID`, `RatedUserID`);
