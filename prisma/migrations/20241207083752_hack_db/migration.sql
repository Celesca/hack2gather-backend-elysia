-- Drop the foreign key constraint first
ALTER TABLE `userteam` DROP FOREIGN KEY `UserTeam_TeamID_fkey`;

-- Now drop the index
DROP INDEX `UserTeam_TeamID_UserID_key` ON `userteam`;

-- Recreate the foreign key constraint with ON DELETE CASCADE
ALTER TABLE `userteam` 
  ADD CONSTRAINT `UserTeam_TeamID_fkey` 
  FOREIGN KEY (`TeamID`) REFERENCES `team`(`TeamID`) ON DELETE CASCADE;