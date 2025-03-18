//homeRoutes.ts
import { Router, Request, Response } from "express";
import prisma from "../prisma";
import { verifyToken } from "../../firebase/middleware/authMiddleware";

const router = Router();

// GET all homes
router.get("/", (req: Request, res: Response) => {
  try {
    const getAllHomes = async () => {
      const homes = await prisma.smartHome.findMany({
        select: { id: true, homeownerId: true, name: true },
      });
      return res.json(homes);
    };

    getAllHomes().catch((error) => {
      console.error("Error fetching homes:", error);
      res.status(500).json({ error: "Failed to fetch homes" });
    });
  } catch (error) {
    console.error("Error fetching homes:", error);
    res.status(500).json({ error: "Failed to fetch homes" });
  }
});

router.get("/user", verifyToken, (req: Request, res: Response) => {
  try {
    const getUserHomes = async () => {
      if (!req.user) {
        return res.status(401).json({ error: "Authentication required" });
      }

      const userId = req.user.id;

      // Get all homes the user has access to through the HomeDweller table
      const accessibleHomes = await prisma.homeDweller.findMany({
        where: {
          userId: userId,
          status: "active", // Only include active statuses
        },
        include: {
          home: {
            select: {
              id: true,
              name: true,
              invitationCode: true,
              createdAt: true,
              homeownerId: true, // Include to determine ownership
            },
          },
        },
        orderBy: {
          home: {
            createdAt: "desc", // Show newest homes first
          },
        },
      });

      // Transform the data to have consistent format
      const homes = accessibleHomes.map((entry) => ({
        id: entry.home.id,
        name: entry.home.name,
        invitationCode: entry.home.invitationCode,
        createdAt: entry.home.createdAt,
        isOwner: entry.home.homeownerId === userId,
        permissionLevel: entry.permissionLevel,
      }));

      return res.json(homes);
    };

    getUserHomes().catch((error) => {
      console.error("Failed to fetch homes:", error);
      res.status(500).json({
        error: "Failed to fetch homes",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    });
  } catch (error) {
    console.error("Failed to fetch homes:", error);
    res.status(500).json({
      error: "Failed to fetch homes",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

interface AuthRequest extends Request {
  user?: {
    id: number;
    firebaseUid: string | null;
    email: string;
    role: string;
  };
}

// Keep this one and remove the non-authenticated version earlier in the file
router.post("/", verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    // Authentication check - handled by verifyToken middleware
    if (!req.user) {
      res.status(401).json({ error: "Authentication required" });
      return;
    }

    const userId = req.user.id;
    const { name } = req.body;

    // Validate input
    if (!name || typeof name !== "string" || name.trim() === "") {
      res.status(400).json({ error: "Valid home name is required" });
      return;
    }

    // Generate a unique invitation code for the home
    const invitationCode = `HOME${Date.now().toString().slice(-6)}${Math.floor(
      Math.random() * 1000
    )}`;

    // Create the new home
    const home = await prisma.smartHome.create({
      data: {
        name: name.trim(),
        invitationCode: invitationCode,
        homeownerId: userId,
      },
    });

    // Add the user as a dweller with owner permissions
    await prisma.homeDweller.create({
      data: {
        userId: userId,
        homeId: home.id,
        permissionLevel: "OWNER",
        status: "active",
      },
    });

    // Populate the home with sample data (rooms, devices, etc.)
    await populateHomeWithSampleData(home.id);

    // Add 2 random users to the home
    await addRandomUsersToHome(home.id);

    res.status(201).json({
      message: "Home created successfully",
      home: {
        id: home.id,
        name: home.name,
        invitationCode: home.invitationCode,
      },
    });
  } catch (error) {
    console.error("Error creating home:", error);
    res.status(500).json({
      error: "Failed to create home",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Helper functions for populating sample data
// These are imported from authRoutes.ts but should be moved to a shared utilities file
async function addRandomUsersToHome(homeId: number) {
  try {
    // List of potential users with actual image paths
    const potentialUsers = [
      {
        name: "Alice",
        email: "alice@example.com",
        profilePictureUrl: "/img1.jpeg",
        firstName: "Alice",
        lastName: "",
      },
      {
        name: "Anna",
        email: "anna@example.com",
        profilePictureUrl: "/anna-profile.avif",
        firstName: "Anna",
        lastName: "Johnson",
      },
      {
        name: "Adrian",
        email: "adrian@example.com",
        profilePictureUrl: "/adrian-profile.avif",
        firstName: "Adrian",
        lastName: "Smith",
      },
      {
        name: "Joshua",
        email: "joshua@example.com",
        profilePictureUrl: "/joshua-profile.avif",
        firstName: "Joshua",
        lastName: "Williams",
      },
      {
        name: "Lily",
        email: "lily@example.com",
        profilePictureUrl: "/lily-profile.avif",
        firstName: "Lily",
        lastName: "Chen",
      },
    ];

    // Shuffle the array and pick 2 random users
    const shuffled = [...potentialUsers].sort(() => 0.5 - Math.random());
    const selectedUsers = shuffled.slice(0, 2);

    for (const userInfo of selectedUsers) {
      // Check if user already exists with this email
      let user = await prisma.user.findUnique({
        where: { email: userInfo.email },
      });

      if (!user) {
        // Create the user if it doesn't exist
        user = await prisma.user.create({
          data: {
            firebaseUid: null, // No Firebase auth for demo users
            email: userInfo.email,
            passwordHash: "demoPassword123", // Simple hash for demo
            role: "user",
            firstName: userInfo.firstName,
            lastName: userInfo.lastName,
            profilePictureUrl: userInfo.profilePictureUrl,
          },
        });
      }

      // Check if the user is already a dweller in this home
      const existingDweller = await prisma.homeDweller.findFirst({
        where: {
          userId: user.id,
          homeId: homeId,
        },
      });

      if (!existingDweller) {
        // Add the user to the home as a dweller
        await prisma.homeDweller.create({
          data: {
            userId: user.id,
            homeId: homeId,
            permissionLevel: "MEMBER", // Regular member permissions
            status: "active",
          },
        });

        console.log(`Added user ${userInfo.name} to home ${homeId}`);
      }
    }

    return true;
  } catch (error) {
    console.error("Error adding random users to home:", error);
    return false;
  }
}

// Helper function to generate realistic daily energy usage based on device type
function generateEnergyUsage(
  deviceType: string,
  date: Date
): {
  energy: number;
  hours: number;
} {
  const devicePatterns: Record<
    string,
    { baseWatts: number; avgHours: number }
  > = {
    light: { baseWatts: 600, avgHours: 8 },
    aircond: { baseWatts: 15000, avgHours: 6 },
    petfeeder: { baseWatts: 200, avgHours: 1 },
    irrigation: { baseWatts: 5000, avgHours: 1 },
    security: { baseWatts: 800, avgHours: 24 },
  };

  const pattern = devicePatterns[deviceType.toLowerCase()] || {
    baseWatts: 1000,
    avgHours: 4,
  };

  // Add seasonal variation
  const month = date.getMonth(); // 0-11
  let seasonalFactor = 1.0;

  if (deviceType.toLowerCase() === "aircond") {
    // Higher in summer months
    seasonalFactor = month >= 5 && month <= 9 ? 1.5 : 0.6;
  } else if (deviceType.toLowerCase() === "light") {
    // Higher in winter months
    seasonalFactor = month <= 1 || month === 11 ? 1.3 : 1.0;
  }

  // Add random variation (±40%)
  const hoursVariation = (0.6 + Math.random() * 0.8) * seasonalFactor;
  const actualHours = Math.min(pattern.avgHours * hoursVariation, 24);

  const energyUsed = pattern.baseWatts * actualHours;

  return {
    energy: Number(energyUsed.toFixed(0)),
    hours: Number(actualHours.toFixed(1)),
  };
}

// Helper function to populate a home with sample data
async function populateHomeWithSampleData(homeId: number) {
  try {
    // Create rooms
    const livingRoom = await prisma.room.create({
      data: {
        homeId: homeId,
        name: "Living Room",
        iconType: "living-room",
      },
    });

    const bedroom = await prisma.room.create({
      data: {
        homeId: homeId,
        name: "Bedroom",
        iconType: "bedroom",
      },
    });

    const garden = await prisma.room.create({
      data: {
        homeId: homeId,
        name: "Garden",
        iconType: "garden",
      },
    });

    // Define devices with their controls
    const devices = [
      {
        displayName: "Lamp",
        room: bedroom,
        type: "light",
        iconType: "lamp",
        status: true,
        controls: [
          {
            controlType: "percentage",
            currentValue: 80,
            minValue: 0,
            maxValue: 100,
          },
        ],
        triggers: [
          {
            triggerType: "Auto Lighting",
            conditionOperator: "Infrared Detection",
            isActive: false,
            featurePeriod: "Daily",
            featureDetail: "8:00pm to 7:00am",
          },
        ],
      },
      {
        displayName: "Air Cond",
        room: bedroom,
        type: "aircond",
        iconType: "aircond",
        status: true,
        controls: [
          {
            controlType: "temperature",
            currentValue: 22,
            minValue: 16,
            maxValue: 30,
          },
          {
            controlType: "FAN_SPEED",
            currentValue: 3,
            minValue: 1,
            maxValue: 5,
          },
        ],
        triggers: [
          {
            triggerType: "Auto AirCond",
            conditionOperator: "Turn on when room temp > 25°C",
            isActive: false,
            featurePeriod: "Daily",
            featureDetail: "9:00pm to 4:00am",
          },
        ],
      },
      {
        displayName: "Pet Feeder",
        room: livingRoom,
        type: "petfeeder",
        iconType: "petfeeder",
        status: false,
        controls: [
          {
            controlType: "percentage",
            currentValue: 0,
            minValue: 0,
            maxValue: 100,
          },
        ],
        triggers: [
          {
            triggerType: "Every Monday",
            conditionOperator: "8:00am",
            isActive: false,
            featurePeriod: "Daily",
            featureDetail: "8:00am, 12:00pm, 7:00pm",
          },
        ],
      },
      {
        displayName: "Irrigation",
        room: garden,
        type: "irrigation",
        iconType: "irrigation",
        status: false,
        controls: [
          {
            controlType: "waterFlow",
            currentValue: 0,
            minValue: 0,
            maxValue: 10,
          },
        ],
        triggers: [
          {
            triggerType: "Auto Irrigation",
            conditionOperator: "Soil Moisture Sensor",
            isActive: false,
            featurePeriod: "Every Monday",
            featureDetail: "8:00am (10 minutes)",
          },
        ],
      },
    ];

    // Create timestamps for past days (use fewer days for new homes to speed up creation)
    const generateTimestamps = (days: number = 90): Date[] => {
      const timestamps: Date[] = [];
      for (let i = 0; i < days; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        date.setHours(12, 0, 0, 0);
        timestamps.push(date);
      }
      return timestamps.sort((a, b) => a.getTime() - b.getTime());
    };

    const timestamps = generateTimestamps(90); // 90 days of data for new homes
    const dailyTimestamps = timestamps.map((date) => {
      const newDate = new Date(date);
      newDate.setHours(0, 0, 0, 0);
      return newDate;
    });

    console.log(`Creating 90 days of energy data for new home ${homeId}`);

    // Create each device and its related data
    for (const deviceData of devices) {
      const device = await prisma.device.create({
        data: {
          roomId: deviceData.room.id,
          displayName: deviceData.displayName,
          type: deviceData.type,
          status: deviceData.status,
          iconType: deviceData.iconType,
          isFavorite: false,
          swiped: false,
          addedAt: new Date(),
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

      // Create triggers for the device
      for (const trigger of deviceData.triggers) {
        await prisma.deviceTrigger.create({
          data: {
            deviceId: device.id,
            ...trigger,
          },
        });
      }

      // Create energy consumption logs
      const energyLogs = timestamps.map((timestamp) => ({
        deviceId: device.id,
        actionType: deviceData.status ? "active" : "idle",
        actionDetails: `${deviceData.displayName} status: ${deviceData.status}`,
        timestamp: timestamp,
      }));

      await prisma.energyConsumptionLog.createMany({
        data: energyLogs,
      });

      // Create daily energy breakdowns - using batch insertion for efficiency
      const breakdownBatchSize = 30;

      for (let i = 0; i < dailyTimestamps.length; i += breakdownBatchSize) {
        const batch = dailyTimestamps.slice(i, i + breakdownBatchSize);
        const breakdownData = batch.map((date) => {
          const usage = generateEnergyUsage(deviceData.type, date);
          return {
            deviceId: device.id,
            energyUsed: usage.energy,
            activeHours: usage.hours,
            timestamp: date,
          };
        });

        await prisma.energyDeviceBreakdown.createMany({
          data: breakdownData,
        });
      }
    }

    // Create solar energy metrics and details for all days
    const solarMetricsBatch = dailyTimestamps.map((timestamp) => ({
      homeId: homeId,
      batteryLevel: 50 + Math.random() * 30,
      equivalentTrees: Math.floor(10 + Math.random() * 5),
      co2EmissionsSaved: 100 + Math.random() * 50,
      standardCoalSaved: 50 + Math.random() * 25,
      timeframe: "DAILY",
      recordedDate: timestamp,
    }));

    await prisma.solarEnergyMetric.createMany({
      data: solarMetricsBatch,
    });

    const solarDetailsBatch = dailyTimestamps.map((timestamp) => ({
      homeId: homeId,
      pvGeneration: 30 + Math.random() * 10,
      importedEnergy: 5 + Math.random() * 5,
      exportedEnergy: 8 + Math.random() * 4,
      loadEnergy: 25 + Math.random() * 10,
      timeframe: "DAILY",
      recordedDate: timestamp,
    }));

    await prisma.solarEnergyDetail.createMany({
      data: solarDetailsBatch,
    });

    console.log(`Successfully populated home ${homeId} with sample data`);
    return true;
  } catch (error) {
    console.error("Error populating home with sample data:", error);
    return false;
  }
}

export default router;
