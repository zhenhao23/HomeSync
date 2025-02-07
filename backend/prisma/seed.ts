import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

// Helper function to generate timestamps for the past 7 days (one per day)
function generateTimestamps(days: number = 7): Date[] {
  const timestamps: Date[] = [];
  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    date.setHours(12, 0, 0, 0); // Set to noon each day
    timestamps.push(date);
  }
  return timestamps.sort((a, b) => a.getTime() - b.getTime());
}

// Helper function to generate realistic daily energy usage based on device type
function generateEnergyUsage(deviceType: string): {
  energy: number;
  hours: number;
} {
  const devicePatterns = {
    LIGHT: { baseWatts: 600, avgHours: 8 },
    AC: { baseWatts: 15000, avgHours: 6 },
    PET_FEEDER: { baseWatts: 200, avgHours: 1 },
    IRRIGATION: { baseWatts: 5000, avgHours: 1 },
    SECURITY: { baseWatts: 800, avgHours: 24 },
  }[deviceType] || { baseWatts: 1000, avgHours: 4 };

  // Add some random variation (±20%)
  const hoursVariation = 0.8 + Math.random() * 0.4;
  const actualHours = Math.min(devicePatterns.avgHours * hoursVariation, 24);

  const energyUsed = devicePatterns.baseWatts * actualHours;

  return {
    energy: Number(energyUsed.toFixed(0)),
    hours: Number(actualHours.toFixed(1)),
  };
}

async function main() {
  // Delete existing data
  await prisma.deviceControl.deleteMany();
  await prisma.deviceTrigger.deleteMany();
  await prisma.energyConsumptionLog.deleteMany();
  await prisma.energyDeviceBreakdown.deleteMany();
  await prisma.device.deleteMany();
  await prisma.room.deleteMany();
  await prisma.solarEnergyMetric.deleteMany();
  await prisma.solarEnergyDetail.deleteMany();
  await prisma.homeDweller.deleteMany();
  await prisma.smartHome.deleteMany();
  await prisma.user.deleteMany();

  // Create initial user
  const john = await prisma.user.create({
    data: {
      email: "john.doe@example.com",
      passwordHash: await bcrypt.hash("password123", 10),
      role: "USER",
      firstName: "John",
      lastName: "Doe",
      profilePictureUrl: "https://example.com/john-profile.jpg",
      twoFactorEnabled: false,
    },
  });

  // Create a smart home
  const home = await prisma.smartHome.create({
    data: {
      homeownerId: john.id,
      invitationCode: "HOME123",
      name: "John's Smart Home",
    },
  });

  // Create rooms
  const livingRoom = await prisma.room.create({
    data: {
      homeId: home.id,
      name: "Living Room",
      iconType: "living-room",
    },
  });

  const bedroom = await prisma.room.create({
    data: {
      homeId: home.id,
      name: "Bedroom",
      iconType: "bedroom",
    },
  });

  const garden = await prisma.room.create({
    data: {
      homeId: home.id,
      name: "Garden",
      iconType: "garden",
    },
  });

  // Define devices with their controls
  const devices = [
    {
      displayName: "Lamp",
      room: bedroom,
      type: "LIGHT",
      iconType: "lamp",
      status: "ON",
      controls: [
        {
          controlType: "BRIGHTNESS",
          currentValue: 80,
          minValue: 0,
          maxValue: 100,
        },
      ],
    },
    {
      displayName: "Air Cond",
      room: bedroom,
      type: "AC",
      iconType: "aircond",
      status: "ON",
      controls: [
        {
          controlType: "TEMPERATURE",
          currentValue: 22,
          minValue: 16,
          maxValue: 30,
        },
        { controlType: "FAN_SPEED", currentValue: 3, minValue: 1, maxValue: 5 },
      ],
    },
    {
      displayName: "Pet Feeder",
      room: livingRoom,
      type: "PET_FEEDER",
      iconType: "petfeeder",
      status: "STANDBY",
      controls: [
        {
          controlType: "PORTION_SIZE",
          currentValue: 1,
          minValue: 0.5,
          maxValue: 3,
        },
      ],
    },
    {
      displayName: "Irrigation",
      room: garden,
      type: "IRRIGATION",
      iconType: "irrigation",
      status: "OFF",
      controls: [
        {
          controlType: "WATER_FLOW",
          currentValue: 0,
          minValue: 0,
          maxValue: 10,
        },
        {
          controlType: "DURATION",
          currentValue: 30,
          minValue: 5,
          maxValue: 120,
        },
      ],
    },
    {
      displayName: "Home Security",
      room: livingRoom,
      type: "SECURITY",
      iconType: "security",
      status: "ARMED",
      controls: [
        {
          controlType: "SENSITIVITY",
          currentValue: 7,
          minValue: 1,
          maxValue: 10,
        },
      ],
    },
  ];

  // Generate timestamps for the past 7 days
  const timestamps = generateTimestamps(7);

  // Create each device and its historical data
  for (const deviceData of devices) {
    const device = await prisma.device.create({
      data: {
        roomId: deviceData.room.id,
        displayName: deviceData.displayName,
        type: deviceData.type,
        status: deviceData.status,
        iconType: deviceData.iconType,
        isFavorite: false,
      },
    });

    // Create controls for the device
    for (const control of deviceData.controls) {
      await prisma.deviceControl.create({
        data: {
          deviceId: device.id,
          ...control,
        },
      });
    }

    // Create energy consumption logs
    const energyLogs = timestamps.map((timestamp) => ({
      deviceId: device.id,
      actionType: deviceData.status === "ON" ? "active" : "idle",
      actionDetails: `${deviceData.displayName} status: ${deviceData.status}`,
      timestamp: timestamp,
    }));

    await prisma.energyConsumptionLog.createMany({
      data: energyLogs,
    });

    // Create daily energy breakdowns
    const dailyTimestamps = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      return date;
    });

    for (const date of dailyTimestamps) {
      const usage = generateEnergyUsage(deviceData.type);
      await prisma.energyDeviceBreakdown.create({
        data: {
          deviceId: device.id,
          energyUsed: usage.energy,
          activeHours: usage.hours,
          timestamp: date,
        },
      });
    }
  }

  // Create solar energy metrics and details for the past 7 days
  for (const timestamp of timestamps) {
    // Create solar metrics
    await prisma.solarEnergyMetric.create({
      data: {
        homeId: home.id,
        batteryLevel: 50 + Math.random() * 30,
        equivalentTrees: Math.floor(10 + Math.random() * 5),
        co2EmissionsSaved: 100 + Math.random() * 50,
        standardCoalSaved: 50 + Math.random() * 25,
        timeframe: "DAILY",
        recordedDate: timestamp,
      },
    });

    // Create solar details
    await prisma.solarEnergyDetail.create({
      data: {
        homeId: home.id,
        pvGeneration: 30 + Math.random() * 10,
        importedEnergy: 5 + Math.random() * 5,
        exportedEnergy: 8 + Math.random() * 4,
        loadEnergy: 25 + Math.random() * 10,
        timeframe: "DAILY",
        recordedDate: timestamp,
      },
    });
  }

  console.log("Seeded database successfully with historical energy data");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
