import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { auth } from "firebase-admin";
import bcrypt from "bcrypt";

const router = express.Router();
const prisma = new PrismaClient();

// POST route for user registration
router.post("/register", (req: Request, res: Response) => {
  try {
    const registerUser = async () => {
      const {
        email,
        password,
        firstName,
        lastName,
        role = "user",
        firebaseUid,
        homeName = "My Home",
      } = req.body;

      // If firebaseUid is provided, use it instead of creating a new Firebase user
      let uid = firebaseUid;

      if (!uid) {
        // Only create Firebase user if no firebaseUid was provided
        const userRecord = await auth().createUser({
          email,
          password,
        });
        uid = userRecord.uid;
      }

      // Create user in Prisma database
      const user = await prisma.user.create({
        data: {
          firebaseUid: uid,
          email,
          passwordHash: password
            ? await hashPassword(password)
            : "google-auth-user",
          firstName,
          lastName,
          role,
        },
      });

      // Generate a unique invitation code for the home
      const invitationCode = `HOME${Date.now()
        .toString()
        .slice(-6)}${Math.floor(Math.random() * 1000)}`;

      // Create a default home for the new user
      const home = await prisma.smartHome.create({
        data: {
          name: homeName,
          invitationCode: invitationCode,
          homeownerId: user.id,
        },
      });

      // Also add the user as a dweller with admin permissions
      // This makes the data model more consistent
      await prisma.homeDweller.create({
        data: {
          userId: user.id,
          homeId: home.id,
          permissionLevel: "OWNER", // Homeowner gets admin permissions
          status: "active", // Already active
        },
      });

      // Populate the home with sample rooms and devices
      await populateHomeWithSampleData(home.id);

      return res.status(201).json({
        message: "User registered successfully",
        userId: user.id,
        homeId: home.id,
      });
    };

    registerUser().catch((error) => {
      console.error("Registration error:", error);
      res.status(500).json({
        error: "Registration failed",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      error: "Registration failed",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Helper function to generate realistic daily energy usage based on device type
function generateEnergyUsage(deviceType: string): {
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

  // Add some random variation (±40%)
  const hoursVariation = 0.6 + Math.random() * 0.8;
  const actualHours = Math.min(pattern.avgHours * hoursVariation, 24);

  const energyUsed = pattern.baseWatts * actualHours;

  return {
    energy: Number(energyUsed.toFixed(0)),
    hours: Number(actualHours.toFixed(1)),
  };
}

// Helper function to populate a home with sample data based on the seed
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

    // Generate timestamps for the past 30 days
    const generateTimestamps = (days: number = 30): Date[] => {
      const timestamps: Date[] = [];
      for (let i = 0; i < days; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        date.setHours(12, 0, 0, 0); // Set to noon each day
        timestamps.push(date);
      }
      return timestamps.sort((a, b) => a.getTime() - b.getTime());
    };

    const timestamps = generateTimestamps(30);

    // Create daily timestamps for energy breakdowns (one per day)
    const dailyTimestamps = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      return date;
    }).sort((a, b) => a.getTime() - b.getTime());

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

      // Create energy consumption logs with historical data for the past 30 days
      const energyLogs = timestamps.map((timestamp) => ({
        deviceId: device.id,
        actionType: deviceData.status ? "active" : "idle",
        actionDetails: `${deviceData.displayName} status: ${deviceData.status}`,
        timestamp: timestamp,
      }));

      await prisma.energyConsumptionLog.createMany({
        data: energyLogs,
      });

      // Create daily energy breakdowns for the past 30 days
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

    // Create solar energy metrics and details for the past 30 days
    for (const timestamp of dailyTimestamps) {
      // Create solar metrics
      await prisma.solarEnergyMetric.create({
        data: {
          homeId: homeId,
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
          homeId: homeId,
          pvGeneration: 30 + Math.random() * 10,
          importedEnergy: 5 + Math.random() * 5,
          exportedEnergy: 8 + Math.random() * 4,
          loadEnergy: 25 + Math.random() * 10,
          timeframe: "DAILY",
          recordedDate: timestamp,
        },
      });
    }

    console.log(
      `Successfully populated home ${homeId} with sample data including historical energy data`
    );
    return true;
  } catch (error) {
    console.error("Error populating home with sample data:", error);
    return false;
  }
}
// // POST route for user registration
// router.post("/register", (req: Request, res: Response) => {
//   try {
//     const registerUser = async () => {
//       const {
//         email,
//         password,
//         firstName,
//         lastName,
//         role = "user",
//         firebaseUid,
//         homeName = "My Home",
//       } = req.body;

//       // If firebaseUid is provided, use it instead of creating a new Firebase user
//       let uid = firebaseUid;

//       if (!uid) {
//         // Only create Firebase user if no firebaseUid was provided
//         const userRecord = await auth().createUser({
//           email,
//           password,
//         });
//         uid = userRecord.uid;
//       }

//       // Create user in Prisma database
//       const user = await prisma.user.create({
//         data: {
//           firebaseUid: uid,
//           email,
//           passwordHash: password
//             ? await hashPassword(password)
//             : "google-auth-user",
//           firstName,
//           lastName,
//           role,
//         },
//       });

//       // Generate a unique invitation code for the home
//       const invitationCode = `HOME${Date.now()
//         .toString()
//         .slice(-6)}${Math.floor(Math.random() * 1000)}`;

//       // Create a default home for the new user
//       const home = await prisma.smartHome.create({
//         data: {
//           name: homeName,
//           invitationCode: invitationCode,
//           homeownerId: user.id,
//         },
//       });

//       // Also add the user as a dweller with admin permissions
//       // This makes the data model more consistent
//       await prisma.homeDweller.create({
//         data: {
//           userId: user.id,
//           homeId: home.id,
//           permissionLevel: "admin", // Homeowner gets admin permissions
//           status: "active", // Already active
//         },
//       });

//       return res.status(201).json({
//         message: "User registered successfully",
//         userId: user.id,
//         homeId: home.id,
//       });
//     };

//     registerUser().catch((error) => {
//       console.error("Registration error:", error);
//       res.status(500).json({
//         error: "Registration failed",
//         details: error instanceof Error ? error.message : "Unknown error",
//       });
//     });
//   } catch (error) {
//     console.error("Registration error:", error);
//     res.status(500).json({
//       error: "Registration failed",
//       details: error instanceof Error ? error.message : "Unknown error",
//     });
//   }
// });

// POST route for login verification
router.post("/login", (req: Request, res: Response) => {
  try {
    const loginVerification = async () => {
      const { idToken } = req.body;

      // Verify Firebase ID token
      const decodedToken = await auth().verifyIdToken(idToken);

      // Find user in Prisma database
      const user = await prisma.user.findUnique({
        where: {
          firebaseUid: decodedToken.uid,
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
        },
      });

      if (!user) {
        return res.status(404).json({ error: "User not found in database" });
      }

      // Find all homes the user has access to through the HomeDweller table
      const accessibleHomes = await prisma.homeDweller.findMany({
        where: {
          userId: user.id,
          status: "active", // Only include active statuses
        },
        select: {
          home: {
            select: {
              id: true,
              name: true,
              homeownerId: true, // Include this to identify owned homes
            },
          },
          permissionLevel: true,
        },
      });

      // Format homes with ownership information
      const homes = accessibleHomes.map((entry) => ({
        id: entry.home.id,
        name: entry.home.name,
        isOwner: entry.home.homeownerId === user.id,
        permissionLevel: entry.permissionLevel,
      }));

      // Include the first home's ID if available
      const defaultHomeId = homes.length > 0 ? homes[0].id : null;

      return res.json({
        message: "Login successful",
        user: user,
        homes: homes,
        defaultHomeId: defaultHomeId,
      });
    };

    loginVerification().catch((error) => {
      console.error("Login verification error:", error);
      res.status(401).json({
        error: "Authentication failed",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    });
  } catch (error) {
    console.error("Login verification error:", error);
    res.status(401).json({
      error: "Authentication failed",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Helper function for password hashing
async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

export default router;
