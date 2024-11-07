-- DropForeignKey
ALTER TABLE `UserSkills` DROP FOREIGN KEY `UserSkills_Skill_ID_fkey`;

-- AddForeignKey
ALTER TABLE `UserSkills` ADD CONSTRAINT `UserSkills_Skill_ID_fkey` FOREIGN KEY (`Skill_ID`) REFERENCES `Skills`(`Skill_ID`) ON DELETE CASCADE ON UPDATE CASCADE;
