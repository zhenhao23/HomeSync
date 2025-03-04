-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "firebaseUid" TEXT,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "profilePictureUrl" TEXT,
    "twoFactorEnabled" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SmartHome" (
    "id" SERIAL NOT NULL,
    "homeownerId" INTEGER NOT NULL,
    "invitationCode" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SmartHome_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HomeDweller" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "homeId" INTEGER NOT NULL,
    "permissionLevel" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HomeDweller_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Room" (
    "id" SERIAL NOT NULL,
    "homeId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "iconType" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Room_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Device" (
    "id" SERIAL NOT NULL,
    "roomId" INTEGER NOT NULL,
    "displayName" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT false,
    "iconType" TEXT NOT NULL,
    "isFavorite" BOOLEAN NOT NULL DEFAULT false,
    "swiped" BOOLEAN NOT NULL DEFAULT false,
    "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Device_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DeviceControl" (
    "id" SERIAL NOT NULL,
    "deviceId" INTEGER NOT NULL,
    "controlType" TEXT NOT NULL,
    "currentValue" DECIMAL(65,30) NOT NULL,
    "minValue" DECIMAL(65,30) NOT NULL,
    "maxValue" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "DeviceControl_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DeviceTrigger" (
    "id" SERIAL NOT NULL,
    "deviceId" INTEGER NOT NULL,
    "triggerType" TEXT NOT NULL,
    "conditionOperator" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "featurePeriod" TEXT NOT NULL DEFAULT 'Daily',
    "featureDetail" TEXT NOT NULL DEFAULT '8:00am, 12:00pm, 7:00pm',

    CONSTRAINT "DeviceTrigger_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EnergyDeviceBreakdown" (
    "id" SERIAL NOT NULL,
    "deviceId" INTEGER NOT NULL,
    "energyUsed" DECIMAL(65,30) NOT NULL,
    "activeHours" DECIMAL(65,30) NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EnergyDeviceBreakdown_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EnergyConsumptionLog" (
    "id" SERIAL NOT NULL,
    "deviceId" INTEGER NOT NULL,
    "actionType" TEXT NOT NULL,
    "actionDetails" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EnergyConsumptionLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SolarEnergyMetric" (
    "id" SERIAL NOT NULL,
    "homeId" INTEGER NOT NULL,
    "batteryLevel" DECIMAL(65,30) NOT NULL,
    "equivalentTrees" INTEGER NOT NULL,
    "co2EmissionsSaved" DECIMAL(65,30) NOT NULL,
    "standardCoalSaved" DECIMAL(65,30) NOT NULL,
    "timeframe" TEXT NOT NULL,
    "recordedDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SolarEnergyMetric_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SolarEnergyDetail" (
    "id" SERIAL NOT NULL,
    "homeId" INTEGER NOT NULL,
    "pvGeneration" DECIMAL(65,30) NOT NULL,
    "importedEnergy" DECIMAL(65,30) NOT NULL,
    "exportedEnergy" DECIMAL(65,30) NOT NULL,
    "loadEnergy" DECIMAL(65,30) NOT NULL,
    "timeframe" TEXT NOT NULL,
    "recordedDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SolarEnergyDetail_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_firebaseUid_key" ON "User"("firebaseUid");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "SmartHome_invitationCode_key" ON "SmartHome"("invitationCode");

-- AddForeignKey
ALTER TABLE "SmartHome" ADD CONSTRAINT "SmartHome_homeownerId_fkey" FOREIGN KEY ("homeownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HomeDweller" ADD CONSTRAINT "HomeDweller_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HomeDweller" ADD CONSTRAINT "HomeDweller_homeId_fkey" FOREIGN KEY ("homeId") REFERENCES "SmartHome"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_homeId_fkey" FOREIGN KEY ("homeId") REFERENCES "SmartHome"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Device" ADD CONSTRAINT "Device_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeviceControl" ADD CONSTRAINT "DeviceControl_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "Device"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeviceTrigger" ADD CONSTRAINT "DeviceTrigger_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "Device"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EnergyDeviceBreakdown" ADD CONSTRAINT "EnergyDeviceBreakdown_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "Device"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EnergyConsumptionLog" ADD CONSTRAINT "EnergyConsumptionLog_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "Device"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SolarEnergyMetric" ADD CONSTRAINT "SolarEnergyMetric_homeId_fkey" FOREIGN KEY ("homeId") REFERENCES "SmartHome"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SolarEnergyDetail" ADD CONSTRAINT "SolarEnergyDetail_homeId_fkey" FOREIGN KEY ("homeId") REFERENCES "SmartHome"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
