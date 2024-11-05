-- CreateTable
CREATE TABLE `User` (
    `UserID` VARCHAR(191) NOT NULL,
    `UserName` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`UserID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Message` (
    `MessageID` INTEGER NOT NULL AUTO_INCREMENT,
    `SenderID` VARCHAR(191) NOT NULL,
    `ReceiverID` VARCHAR(191) NOT NULL,
    `MessageContent` VARCHAR(191) NOT NULL,
    `Timestamp` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `ReadStatus` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`MessageID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Swipe` (
    `SwipeID` INTEGER NOT NULL AUTO_INCREMENT,
    `SwipingUserID` VARCHAR(191) NOT NULL,
    `SwipedUserID` VARCHAR(191) NOT NULL,
    `SwipeAction` VARCHAR(191) NOT NULL,
    `Timestamp` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`SwipeID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Notification` (
    `NotificationID` INTEGER NOT NULL AUTO_INCREMENT,
    `UserID` VARCHAR(191) NOT NULL,
    `NotificationContent` VARCHAR(191) NOT NULL,
    `Timestamp` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `ReadStatus` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`NotificationID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Skills` (
    `Skill_ID` INTEGER NOT NULL AUTO_INCREMENT,
    `Skill_Name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Skills_Skill_Name_key`(`Skill_Name`),
    PRIMARY KEY (`Skill_ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserSkills` (
    `UserSkill_ID` INTEGER NOT NULL AUTO_INCREMENT,
    `UserID` VARCHAR(191) NOT NULL,
    `Skill_ID` INTEGER NOT NULL,

    PRIMARY KEY (`UserSkill_ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Message` ADD CONSTRAINT `Message_SenderID_fkey` FOREIGN KEY (`SenderID`) REFERENCES `User`(`UserID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Message` ADD CONSTRAINT `Message_ReceiverID_fkey` FOREIGN KEY (`ReceiverID`) REFERENCES `User`(`UserID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Swipe` ADD CONSTRAINT `Swipe_SwipingUserID_fkey` FOREIGN KEY (`SwipingUserID`) REFERENCES `User`(`UserID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Swipe` ADD CONSTRAINT `Swipe_SwipedUserID_fkey` FOREIGN KEY (`SwipedUserID`) REFERENCES `User`(`UserID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_UserID_fkey` FOREIGN KEY (`UserID`) REFERENCES `User`(`UserID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserSkills` ADD CONSTRAINT `UserSkills_UserID_fkey` FOREIGN KEY (`UserID`) REFERENCES `User`(`UserID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserSkills` ADD CONSTRAINT `UserSkills_Skill_ID_fkey` FOREIGN KEY (`Skill_ID`) REFERENCES `Skills`(`Skill_ID`) ON DELETE RESTRICT ON UPDATE CASCADE;
