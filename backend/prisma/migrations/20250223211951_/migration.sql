/*
  Warnings:

  - The `status` column on the `Device` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Device" ADD COLUMN     "swiped" BOOLEAN NOT NULL DEFAULT false,
DROP COLUMN "status",
ADD COLUMN     "status" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "DeviceTrigger" ADD COLUMN     "featureDetail" TEXT NOT NULL DEFAULT '8:00am, 12:00pm, 7:00pm',
ADD COLUMN     "featurePeriod" TEXT NOT NULL DEFAULT 'Daily';
