-- CreateTable
CREATE TABLE `Personal` (
    `PersonalID` INTEGER NOT NULL AUTO_INCREMENT,
    `Personal_type` VARCHAR(191) NOT NULL,
    `Personal_type_detail` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`PersonalID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserPersonal` (
    `UserPersonalID` INTEGER NOT NULL AUTO_INCREMENT,
    `UserID` VARCHAR(191) NOT NULL,
    `PersonalID` INTEGER NOT NULL,

    PRIMARY KEY (`UserPersonalID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `UserPersonal` ADD CONSTRAINT `UserPersonal_UserID_fkey` FOREIGN KEY (`UserID`) REFERENCES `User`(`UserID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserPersonal` ADD CONSTRAINT `UserPersonal_PersonalID_fkey` FOREIGN KEY (`PersonalID`) REFERENCES `Personal`(`PersonalID`) ON DELETE RESTRICT ON UPDATE CASCADE;
