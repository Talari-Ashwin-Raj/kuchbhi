-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` ENUM('SUPERADMIN', 'MANAGER', 'DRIVER', 'USER') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Manager` (
    `userId` VARCHAR(191) NOT NULL,
    `status` ENUM('PENDING', 'ACTIVE', 'SUSPENDED') NOT NULL DEFAULT 'PENDING',

    PRIMARY KEY (`userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ParkingArea` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `location` VARCHAR(191) NOT NULL,
    `qrCode` VARCHAR(191) NOT NULL,
    `amount` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `managerId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `ParkingArea_qrCode_key`(`qrCode`),
    UNIQUE INDEX `ParkingArea_managerId_key`(`managerId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Driver` (
    `userId` VARCHAR(191) NOT NULL,
    `parkingAreaId` VARCHAR(191) NOT NULL,
    `status` ENUM('AVAILABLE', 'BUSY', 'INACTIVE') NOT NULL DEFAULT 'AVAILABLE',
    `dlNumber` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Driver_dlNumber_key`(`dlNumber`),
    PRIMARY KEY (`userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Ticket` (
    `ticketNumber` VARCHAR(191) NOT NULL,
    `status` ENUM('REQUESTED', 'DRIVER_ASSIGNED', 'PARKING_STARTED', 'PARKED', 'CAR_ON_THE_WAY', 'COMPLETED') NOT NULL DEFAULT 'REQUESTED',
    `carId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `userId` VARCHAR(191) NOT NULL,
    `parkingAreaId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`ticketNumber`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DriverRequest` (
    `id` VARCHAR(191) NOT NULL,
    `requestType` ENUM('PARKING', 'RETRIEVAL') NOT NULL,
    `ticketNo` VARCHAR(191) NOT NULL,
    `driverId` VARCHAR(191) NULL,
    `status` ENUM('PENDING', 'APPROVED') NOT NULL DEFAULT 'PENDING',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Car` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `plateNumber` VARCHAR(191) NOT NULL,
    `brand` VARCHAR(191) NOT NULL,
    `model` VARCHAR(191) NOT NULL,
    `color` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Manager` ADD CONSTRAINT `Manager_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ParkingArea` ADD CONSTRAINT `ParkingArea_managerId_fkey` FOREIGN KEY (`managerId`) REFERENCES `Manager`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Driver` ADD CONSTRAINT `Driver_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Driver` ADD CONSTRAINT `Driver_parkingAreaId_fkey` FOREIGN KEY (`parkingAreaId`) REFERENCES `ParkingArea`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Ticket` ADD CONSTRAINT `Ticket_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Ticket` ADD CONSTRAINT `Ticket_parkingAreaId_fkey` FOREIGN KEY (`parkingAreaId`) REFERENCES `ParkingArea`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Ticket` ADD CONSTRAINT `Ticket_carId_fkey` FOREIGN KEY (`carId`) REFERENCES `Car`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DriverRequest` ADD CONSTRAINT `DriverRequest_driverId_fkey` FOREIGN KEY (`driverId`) REFERENCES `Driver`(`userId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DriverRequest` ADD CONSTRAINT `DriverRequest_ticketNo_fkey` FOREIGN KEY (`ticketNo`) REFERENCES `Ticket`(`ticketNumber`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Car` ADD CONSTRAINT `Car_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
