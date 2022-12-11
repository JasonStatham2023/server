-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `account` VARCHAR(191) NOT NULL,
    `password` VARCHAR(255) NULL,
    `email` VARCHAR(191) NOT NULL,
    `isAdmin` BOOLEAN NULL DEFAULT false,
    `balance` DECIMAL(10, 2) NULL DEFAULT 0.00,
    `accountFrozen` DECIMAL(10, 2) NULL DEFAULT 0.00,
    `withdrawalAmount` DECIMAL(10, 2) NULL DEFAULT 0.00,
    `walletAddress` VARCHAR(255) NULL,
    `walletPassword` VARCHAR(255) NULL,
    `isActive` BOOLEAN NULL DEFAULT false,
    `inviterId` INTEGER NULL,
    `inviterCode` INTEGER NULL,
    `timestamp` INTEGER NULL DEFAULT 0,
    `gold` INTEGER NULL DEFAULT 0,
    `token` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_account_key`(`account`),
    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserProfile` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `authCode` VARCHAR(191) NOT NULL,
    `isUse` BOOLEAN NULL DEFAULT false,
    `token` TEXT NULL,
    `userId` INTEGER NULL,
    `timestamp` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `VideoFile` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `fileId` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `File` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `url` VARCHAR(255) NULL,
    `size` INTEGER NULL,
    `md5FileName` VARCHAR(191) NULL,
    `name` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Zone` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `coverId` INTEGER NULL,
    `maxFreezesNum` INTEGER NOT NULL DEFAULT 0,
    `probability` INTEGER NOT NULL DEFAULT 0,
    `unitPrice` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    `shareProfit` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    `takes` INTEGER NOT NULL DEFAULT 0,
    `introduce` TEXT NOT NULL,
    `htmlIntroduce` TEXT NOT NULL,
    `award` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    `gold` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OrderRecord` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `earnings` DECIMAL(10, 2) NOT NULL,
    `amount` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    `status` INTEGER NOT NULL DEFAULT 0,
    `freezeExpiresTime` DATETIME(3) NULL,
    `zoneId` INTEGER NULL,
    `userId` INTEGER NULL,
    `frozenRecordId` INTEGER NULL,
    `timestamp` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FrozenRecord` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `status` INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RechargeRecord` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NULL,
    `type` INTEGER NOT NULL DEFAULT 0,
    `transactionHash` VARCHAR(255) NULL DEFAULT '',
    `amount` DECIMAL(10, 2) NOT NULL,
    `specialAmount` DECIMAL(10, 2) NOT NULL DEFAULT 0,
    `status` INTEGER NOT NULL DEFAULT 0,
    `failureReasons` VARCHAR(255) NULL DEFAULT '',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `WithdrawalRecord` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NULL,
    `type` INTEGER NOT NULL DEFAULT 0,
    `account` VARCHAR(191) NOT NULL,
    `transactionHash` VARCHAR(255) NULL DEFAULT '',
    `amount` DECIMAL(10, 2) NOT NULL,
    `specialAmount` DECIMAL(10, 2) NOT NULL DEFAULT 0,
    `status` INTEGER NOT NULL DEFAULT 0,
    `failureReasons` VARCHAR(255) NULL DEFAULT '',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `InviteEarningsRecord` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `inviteeId` INTEGER NOT NULL,
    `account` VARCHAR(191) NOT NULL,
    `earnings` DECIMAL(10, 2) NOT NULL DEFAULT 0,
    `userId` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `InviteEarningsRecord_inviteeId_key`(`inviteeId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `UserProfile` ADD CONSTRAINT `UserProfile_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `VideoFile` ADD CONSTRAINT `VideoFile_fileId_fkey` FOREIGN KEY (`fileId`) REFERENCES `File`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Zone` ADD CONSTRAINT `Zone_coverId_fkey` FOREIGN KEY (`coverId`) REFERENCES `File`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderRecord` ADD CONSTRAINT `OrderRecord_zoneId_fkey` FOREIGN KEY (`zoneId`) REFERENCES `Zone`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderRecord` ADD CONSTRAINT `OrderRecord_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderRecord` ADD CONSTRAINT `OrderRecord_frozenRecordId_fkey` FOREIGN KEY (`frozenRecordId`) REFERENCES `FrozenRecord`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FrozenRecord` ADD CONSTRAINT `FrozenRecord_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RechargeRecord` ADD CONSTRAINT `RechargeRecord_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `WithdrawalRecord` ADD CONSTRAINT `WithdrawalRecord_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InviteEarningsRecord` ADD CONSTRAINT `InviteEarningsRecord_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
