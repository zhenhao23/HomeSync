import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { auth } from "firebase-admin";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const router = express.Router();
const prisma = new PrismaClient();

// In-memory OTP storage (in production, use a database or Redis)
const otpStore: Record<
  string,
  {
    otp: string;
    expires: Date;
    email?: string; // Add email property
    firstName?: string; // Add firstName property
  }
> = {};

// Function to send invitation code email to home owner
async function sendInvitationCodeEmail(
  email: string,
  firstName: string,
  invitationCode: string,
  homeName: string
): Promise<boolean> {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "HomeSync - Your Home Invitation Code",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #3498db;">HomeSync</h1>
          </div>
          <div style="padding: 20px; background-color: #f9f9f9; border-radius: 4px;">
            <p>Hello ${firstName},</p>
            <p>Your HomeSync smart home "${homeName}" has been successfully created!</p>
            <p>Here's your home's invitation code that you can share with family members or roommates:</p>
            <div style="text-align: center; margin: 30px 0;">
              <div style="display: inline-block; padding: 15px 30px; background-color: #3498db; color: white; font-size: 24px; font-weight: bold; letter-spacing: 5px; border-radius: 4px;">
                ${invitationCode}
              </div>
            </div>
            <p>To invite others to join your home:</p>
            <ol>
              <li>Ask them to create a HomeSync account</li>
              <li>They should select "Home Dweller" as their role</li>
              <li>They'll need to enter this 4-digit invitation code</li>
            </ol>
            <p>You'll be able to manage all members of your home from your HomeSync dashboard.</p>
          </div>
          <div style="margin-top: 20px; text-align: center; color: #7f8c8d; font-size: 12px;">
            <p>© ${new Date().getFullYear()} HomeSync. All rights reserved.</p>
          </div>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Invitation code email sent:", info.response);
    return true;
  } catch (error) {
    console.error("Error sending invitation code email:", error);
    return false;
  }
}

// New endpoint for completing registration and joining a home
router.post("/join-home-with-registration", (req: Request, res: Response) => {
  const joinWithRegistration = async () => {
    try {
      const {
        email,
        password,
        firstName,
        lastName,
        role,
        firebaseUid,
        invitationCode,
        registrationMethod,
      } = req.body;

      // Check if the invitation code is valid
      const home = await prisma.smartHome.findUnique({
        where: { invitationCode },
      });

      if (!home) {
        return res.status(404).json({
          error:
            "Invalid invitation code. The home you're trying to join doesn't exist.",
        });
      }

      // Create user in Prisma database
      const user = await prisma.user.create({
        data: {
          firebaseUid,
          email,
          passwordHash:
            registrationMethod === "google"
              ? "google-auth-user"
              : await bcrypt.hash(password, 10),
          firstName,
          lastName,
          role,
        },
      });

      // Add the user as a dweller with MEMBER permissions
      // Change status to "active" instead of "pending" to fix the 403 error
      await prisma.homeDweller.create({
        data: {
          userId: user.id,
          homeId: home.id,
          permissionLevel: "MEMBER",
          status: "active", // Changed from "pending" to "active"
        },
      });

      return res.status(201).json({
        message:
          "Registration completed successfully. You have joined the home.",
        userId: user.id,
        homeId: home.id,
        homeName: home.name,
        status: "active", // Updated to match the new status
      });
    } catch (error) {
      console.error("Join home with registration error:", error);
      return res.status(500).json({
        error: "Failed to complete registration and join home",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

  joinWithRegistration().catch((error) => {
    console.error("Join home with registration error:", error);
    res.status(500).json({
      error: "Failed to complete registration and join home",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  });
});

// Function to generate a random 4-digit OTP
function generateOTP(): string {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Function to send OTP email
async function sendOTPEmail(
  email: string,
  otp: string,
  firstName: string
): Promise<boolean> {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "HomeSync - Account Verification Code",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #3498db;">HomeSync</h1>
          </div>
          <div style="padding: 20px; background-color: #f9f9f9; border-radius: 4px;">
            <p>Hello ${firstName},</p>
            <p>Welcome to HomeSync! To complete your registration, please use the verification code below:</p>
            <div style="text-align: center; margin: 30px 0;">
              <div style="display: inline-block; padding: 15px 30px; background-color: #3498db; color: white; font-size: 24px; font-weight: bold; letter-spacing: 5px; border-radius: 4px;">
                ${otp}
              </div>
            </div>
            <p>This code will expire in 10 minutes.</p>
            <p>If you didn't request this code, please ignore this email.</p>
          </div>
          <div style="margin-top: 20px; text-align: center; color: #7f8c8d; font-size: 12px;">
            <p>© ${new Date().getFullYear()} HomeSync. All rights reserved.</p>
          </div>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
}

// Update the complete-registration endpoint
// Update the complete-registration endpoint
router.post("/complete-registration", (req: Request, res: Response) => {
  const completeRegistration = async () => {
    try {
      const {
        email,
        password,
        firstName,
        lastName,
        role,
        firebaseUid,
        homeName,
        googleUser = false,
      } = req.body;

      // Create user in Prisma database
      const user = await prisma.user.create({
        data: {
          firebaseUid,
          email,
          passwordHash: googleUser
            ? "google-auth-user"
            : await hashPassword(password),
          firstName,
          lastName,
          role,
        },
      });

      // If role is owner, create a home
      if (role === "owner") {
        // Generate a unique invitation code for the home
        const invitationCode = Math.floor(
          1000 + Math.random() * 9000
        ).toString();

        // Create personalized home name using firstName
        const personalizedHomeName = homeName || `${firstName}'s Home`;

        // Create the home
        const home = await prisma.smartHome.create({
          data: {
            name: personalizedHomeName,
            invitationCode: invitationCode,
            homeownerId: user.id,
          },
        });

        // Add the user as a dweller with owner permissions
        await prisma.homeDweller.create({
          data: {
            userId: user.id,
            homeId: home.id,
            permissionLevel: "OWNER",
            status: "active",
          },
        });

        // Add random users and populate with sample data
        await addRandomUsersToHome(home.id);
        await populateHomeWithSampleData(home.id);

        // Send invitation code email to the home owner
        await sendInvitationCodeEmail(
          email,
          firstName,
          invitationCode,
          personalizedHomeName
        );

        return res.status(201).json({
          message:
            "Registration completed successfully. Invitation code has been sent to your email.",
          userId: user.id,
          homeId: home.id,
          role: "owner",
          invitationCode: invitationCode, // Optionally include the code in the response
        });
      } else {
        // For dwellers, just return the user info
        return res.status(201).json({
          message: "Registration completed successfully",
          userId: user.id,
          role: "dweller",
        });
      }
    } catch (error) {
      console.error("Complete registration error:", error);
      return res.status(500).json({
        error: "Registration completion failed",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

  completeRegistration().catch((error) => {
    console.error("Complete registration error:", error);
    res.status(500).json({
      error: "Registration completion failed",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  });
});

// New endpoint to verify OTP without account creation
router.post("/verify-otp-only", (req: Request, res: Response) => {
  const verifyOtp = async () => {
    try {
      const { email, otp } = req.body;

      // Find the OTP entry by email
      let tempId = null;
      let otpData = null;

      // Search through otpStore for matching email
      for (const [id, data] of Object.entries(otpStore)) {
        if (data.email === email) {
          tempId = id;
          otpData = data;
          break;
        }
      }

      if (!tempId || !otpData) {
        return res.status(400).json({
          error: "No OTP found for this email. Please request a new code.",
        });
      }

      // Check if OTP is expired
      if (new Date() > otpData.expires) {
        delete otpStore[tempId];
        return res.status(400).json({
          error: "OTP expired. Please request a new code.",
        });
      }

      // Verify OTP
      if (otpData.otp !== otp) {
        return res.status(400).json({
          error: "Invalid OTP. Please try again.",
        });
      }

      // Remove OTP from store
      delete otpStore[tempId];

      return res.status(200).json({
        message: "Email verified successfully",
        verified: true,
      });
    } catch (error) {
      console.error("OTP-only verification error:", error);
      return res.status(500).json({
        error: "Verification failed",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

  verifyOtp().catch((error) => {
    console.error("OTP verification error:", error);
    res.status(500).json({
      error: "Verification failed",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  });
});

// New endpoint to send OTP without creating accounts yet
router.post("/send-otp", (req: Request, res: Response) => {
  const sendOtp = async () => {
    try {
      const { email, firstName } = req.body;

      // Check if email already exists
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return res.status(400).json({
          error: "Email already registered",
          details:
            "This email is already registered. Please use a different email.",
        });
      }

      // Generate a temporary ID to associate with this OTP
      const tempId = `temp_${Date.now()}_${Math.random()
        .toString(36)
        .substring(2, 15)}`;

      // Generate OTP and store it
      const otp = generateOTP();

      // Set expiration (10 minutes)
      const expiryTime = new Date();
      expiryTime.setMinutes(expiryTime.getMinutes() + 10);

      // Store OTP with temporary ID as key
      otpStore[tempId] = {
        otp,
        expires: expiryTime,
        email, // Store email to associate with this OTP
        firstName, // Store firstName for email sending
      };

      // Send OTP email
      await sendOTPEmail(email, otp, firstName);

      return res.status(200).json({
        message: "Verification code sent successfully",
        tempId: tempId, // Return tempId for verification
      });
    } catch (error) {
      console.error("Send OTP error:", error);
      return res.status(500).json({
        error: "Failed to send verification code",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

  sendOtp().catch((error) => {
    console.error("Send OTP error:", error);
    res.status(500).json({
      error: "Failed to send verification code",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  });
});

// New endpoint to verify email exists
router.post("/check-email", (req: Request, res: Response) => {
  const checkEmail = async () => {
    try {
      const { email } = req.body;

      // Check if email already exists
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return res.status(400).json({ error: "Email already registered" });
      }

      return res.status(200).json({ message: "Email available" });
    } catch (error) {
      console.error("Check email error:", error);
      return res.status(500).json({
        error: "Failed to check email",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

  checkEmail().catch((error) => {
    console.error("Check email error:", error);
    res.status(500).json({
      error: "Failed to check email",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  });
});

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
        homeName,
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
      const invitationCode = Math.floor(1000 + Math.random() * 9000).toString();

      // Create personalized home name using firstName
      const personalizedHomeName = homeName || `${firstName}'s Home`;

      // Create a default home for the new user
      const home = await prisma.smartHome.create({
        data: {
          name: personalizedHomeName,
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

      // Add 2 random users to the home
      await addRandomUsersToHome(home.id);

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

// Add this helper function to create random users and add them to the home
async function addRandomUsersToHome(homeId: number) {
  try {
    // List of potential users based on ProfilePage.tsx with actual image paths
    const potentialUsers = [
      {
        name: "Alice",
        email: "alice@example.com",
        profilePictureUrl: "/img1.jpeg", // Using default ProfileImage
        firstName: "Alice",
        lastName: "",
      },
      {
        name: "Anna",
        email: "anna@example.com",
        profilePictureUrl: "/anna-profile.avif", // Using AnnaProfilePic
        firstName: "Anna",
        lastName: "Johnson",
      },
      {
        name: "Adrian",
        email: "adrian@example.com",
        profilePictureUrl: "/adrian-profile.avif", // Using AdrianProfilePic
        firstName: "Adrian",
        lastName: "Smith",
      },
      {
        name: "Joshua",
        email: "joshua@example.com",
        profilePictureUrl: "/joshua-profile.avif", // Using JoshuaProfilePic
        firstName: "Joshua",
        lastName: "Williams",
      },
      {
        name: "Lily",
        email: "lily@example.com",
        profilePictureUrl: "/lily-profile.avif", // Using LilyProfilePic
        firstName: "Lily",
        lastName: "Chen",
      },
    ];

    // Shuffle the array and pick 2 random users
    const shuffled = [...potentialUsers].sort(() => 0.5 - Math.random());
    const selectedUsers = shuffled.slice(0, 2);

    for (const userInfo of selectedUsers) {
      // Create the user in the database
      const user = await prisma.user.create({
        data: {
          firebaseUid: null, // No Firebase auth for demo users
          email: userInfo.email,
          passwordHash: await hashPassword("demoPassword123"), // Simple password that won't be used
          role: "user",
          firstName: userInfo.firstName,
          lastName: userInfo.lastName,
          profilePictureUrl: userInfo.profilePictureUrl,
        },
      });

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
    light: { baseWatts: 3000, avgHours: 8 },
    aircond: { baseWatts: 15000, avgHours: 6 },
    petfeeder: { baseWatts: 2000, avgHours: 1 },
    irrigation: { baseWatts: 5000, avgHours: 1 },
    security: { baseWatts: 800, avgHours: 24 },
  };

  const pattern = devicePatterns[deviceType.toLowerCase()] || {
    baseWatts: 1000,
    avgHours: 4,
  };

  // Add seasonal variation (more AC in summer, more lights in winter)
  const month = date.getMonth(); // 0-11
  let seasonalFactor = 1.0;

  if (deviceType.toLowerCase() === "aircond") {
    // Higher in summer months (May-Sept: 5-9)
    seasonalFactor = month >= 5 && month <= 9 ? 1.5 : 0.6;
  } else if (deviceType.toLowerCase() === "light") {
    // Higher in winter months (Nov-Feb: 0-1, 11)
    seasonalFactor = month <= 1 || month === 11 ? 1.3 : 1.0;
  }

  // Add some random variation (±40%)
  const hoursVariation = (0.2 + Math.random() * 1.6) * seasonalFactor;
  const actualHours = Math.min(pattern.avgHours * hoursVariation, 24);

  // In populateHomeWithSampleData
  const householdEnergyFactor = 0.7 + Math.random() * 0.6; // 0.7-1.3x multiplier

  // Then in generateEnergyUsage
  const energyUsed = pattern.baseWatts * actualHours * householdEnergyFactor;

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

    // Generate timestamps for the past 90 days (for energy consumption logs)
    const generateTimestamps = (days: number = 400): Date[] => {
      const timestamps: Date[] = [];
      for (let i = 0; i < days; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        date.setHours(12, 0, 0, 0); // Set to noon each day
        timestamps.push(date);
      }
      return timestamps.sort((a, b) => a.getTime() - b.getTime());
    };

    const timestamps = generateTimestamps(400);

    // Create daily timestamps for energy breakdowns (one per day for the past 900 days)
    const dailyTimestamps = Array.from({ length: 400 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      return date;
    }).sort((a, b) => a.getTime() - b.getTime());

    console.log(
      "Creating 400 days of energy data from",
      dailyTimestamps[0],
      "to",
      dailyTimestamps[dailyTimestamps.length - 1]
    );

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

      // Create energy consumption logs with historical data for the past 90 days
      const energyLogs = timestamps.map((timestamp) => ({
        deviceId: device.id,
        actionType: deviceData.status ? "active" : "idle",
        actionDetails: `${deviceData.displayName} status: ${deviceData.status}`,
        timestamp: timestamp,
      }));

      await prisma.energyConsumptionLog.createMany({
        data: energyLogs,
      });

      // Create daily energy breakdowns for the past 900 days - using batch insertion for efficiency
      const breakdownBatchSize = 100;

      for (let i = 0; i < dailyTimestamps.length; i += breakdownBatchSize) {
        const batch = dailyTimestamps.slice(i, i + breakdownBatchSize);
        const breakdownData = batch.map((date) => {
          const usage = generateEnergyUsage(deviceData.type, date);

          // ADD THIS LOG HERE - to check specific older data points
          if (i === 0 && date < new Date("2025-01-01")) {
            console.log(
              `Creating energy data for ${
                date.toISOString().split("T")[0]
              }: device=${deviceData.type}, energy=${usage.energy}`
            );
          }

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

        // Log progress for long operations
        console.log(
          `Created energy breakdowns for device ${device.id}: ${i} to ${
            i + batch.length
          } of ${dailyTimestamps.length}`
        );
      }
    }

    // Create solar energy metrics and details for the past 90 days
    // We'll only do 90 days of solar data to keep the DB size reasonable
    const recentTimestamps = dailyTimestamps.slice(-90);

    const solarMetricsBatch = recentTimestamps.map((timestamp) => ({
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

    const solarDetailsBatch = recentTimestamps.map((timestamp) => ({
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

    // ADD THIS LOG HERE - after creating all data
    const count = await prisma.energyDeviceBreakdown.count({
      where: {
        device: {
          room: {
            homeId: homeId,
          },
        },
      },
    });
    console.log(`Created ${count} energy breakdown records for home ${homeId}`);

    console.log(
      `Successfully populated home ${homeId} with sample data including 900 days of historical energy data`
    );
    return true;
  } catch (error) {
    console.error("Error populating home with sample data:", error);
    return false;
  }
}

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
