import { Router, Request, Response } from "express";
import prisma from "../prisma";
import { verifyToken } from "../../firebase/middleware/authMiddleware";
import { ParamsDictionary } from "express-serve-static-core";

const router = Router();

interface DeviceParams extends ParamsDictionary {
  id: string;
}

// Apply authentication to all routes
router.use(verifyToken);

// GET all devices - secured with authentication and filtered by accessible homes
router.get("/", (req: Request, res: Response) => {
  try {
    const getAllDevices = async () => {
      // Authentication check
      if (!req.user) {
        return res.status(401).json({ error: "Authentication required" });
      }

      const userId = req.user.id;

      // Get all homes the user has access to
      const accessibleHomes = await prisma.homeDweller.findMany({
        where: {
          userId: userId,
          status: "active",
        },
        select: {
          homeId: true,
        },
      });

      const homeIds = accessibleHomes.map((home) => home.homeId);

      if (homeIds.length === 0) {
        return res.json([]); // User doesn't have access to any homes
      }

      // Get all rooms in the accessible homes
      const rooms = await prisma.room.findMany({
        where: {
          homeId: {
            in: homeIds,
          },
        },
        select: {
          id: true,
        },
      });

      const roomIds = rooms.map((room) => room.id);

      // Get all devices in those rooms
      const devices = await prisma.device.findMany({
        where: {
          roomId: {
            in: roomIds,
          },
        },
        include: {
          controls: true,
          triggers: true,
          energyLogs: {
            orderBy: {
              timestamp: "desc",
            },
            take: 1,
          },
          room: {
            include: {
              home: {
                select: {
                  id: true,
                  name: true,
                  homeownerId: true,
                },
              },
            },
          },
        },
      });

      return res.json(devices);
    };

    getAllDevices().catch((error) => {
      console.error("Error fetching devices:", error);
      res.status(500).json({
        error: "Failed to fetch devices",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    });
  } catch (error) {
    console.error("Error fetching devices:", error);
    res.status(500).json({
      error: "Failed to fetch devices",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// GET device by ID - secured with authentication and home access check
router.get("/:id", (req: Request<DeviceParams>, res: Response) => {
  try {
    const getDeviceById = async () => {
      const deviceId = parseInt(req.params.id);

      if (isNaN(deviceId)) {
        return res.status(400).json({ error: "Invalid device ID" });
      }

      // Authentication check
      if (!req.user) {
        return res.status(401).json({ error: "Authentication required" });
      }

      const userId = req.user.id;

      // Find the device with its room and home info
      const device = await prisma.device.findUnique({
        where: { id: deviceId },
        include: {
          controls: true,
          triggers: true,
          energyLogs: {
            orderBy: {
              timestamp: "desc",
            },
            take: 1,
          },
          room: {
            include: {
              home: true,
            },
          },
        },
      });

      if (!device) {
        return res.status(404).json({ error: "Device not found" });
      }

      // Check if the user has access to the home containing this device
      const hasAccess = await prisma.homeDweller.findFirst({
        where: {
          homeId: device.room.homeId,
          userId: userId,
          status: "active",
        },
      });

      if (!hasAccess) {
        return res
          .status(403)
          .json({ error: "You don't have access to this device" });
      }

      return res.json(device);
    };

    getDeviceById().catch((error) => {
      console.error("Error fetching device:", error);
      res.status(500).json({
        error: "Failed to fetch device",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    });
  } catch (error) {
    console.error("Error fetching device:", error);
    res.status(500).json({
      error: "Failed to fetch device",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// POST new device - secured with authentication and home access check
router.post("/", (req: Request, res: Response) => {
  try {
    const createDevice = async () => {
      const { roomId, displayName, type, iconType, isFavorite } = req.body;

      // Validate required fields
      if (!roomId || !displayName || !type || !iconType) {
        return res.status(400).json({
          error: "Missing required fields",
          required: ["roomId", "displayName", "type", "iconType"],
        });
      }

      // Authentication check
      if (!req.user) {
        return res.status(401).json({ error: "Authentication required" });
      }

      const userId = req.user.id;

      // Get the room to find its homeId
      const room = await prisma.room.findUnique({
        where: { id: parseInt(roomId) },
        select: { homeId: true },
      });

      if (!room) {
        return res.status(404).json({ error: "Room not found" });
      }

      // Check if user has access to the home containing this room
      const hasAccess = await prisma.homeDweller.findFirst({
        where: {
          homeId: room.homeId,
          userId: userId,
          status: "active",
        },
      });

      if (!hasAccess) {
        return res
          .status(403)
          .json({ error: "You don't have access to this home" });
      }

      // Create the new device
      const newDevice = await prisma.device.create({
        data: {
          roomId: parseInt(roomId),
          displayName,
          type,
          iconType,
          isFavorite: isFavorite || false,
          status: false, // Default to off
        },
      });

      // Create default controls based on device type
      await createDefaultControls(newDevice.id, type.toLowerCase());

      // Create default triggers based on device type
      await createDefaultTriggers(newDevice.id, type.toLowerCase());

      // Fetch the complete device with its related data
      const deviceWithRelations = await prisma.device.findUnique({
        where: { id: newDevice.id },
        include: {
          controls: true,
          triggers: true,
          room: {
            include: {
              home: {
                select: {
                  id: true,
                  name: true,
                  homeownerId: true,
                },
              },
            },
          },
        },
      });

      return res.status(201).json(deviceWithRelations);
    };

    createDevice().catch((error) => {
      console.error("Error creating device:", error);
      res.status(500).json({
        error: "Failed to create device",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    });
  } catch (error) {
    console.error("Error creating device:", error);
    res.status(500).json({
      error: "Failed to create device",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Helper function to create default controls based on device type
async function createDefaultControls(deviceId: number, deviceType: string) {
  type ControlConfig = {
    controlType: string;
    currentValue: number;
    minValue: number;
    maxValue: number;
  }[];

  const controlsConfig: Record<string, ControlConfig> = {
    light: [
      {
        controlType: "percentage",
        currentValue: 0,
        minValue: 0,
        maxValue: 100,
      },
    ],
    aircond: [
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
    petfeeder: [
      {
        controlType: "percentage",
        currentValue: 0,
        minValue: 0,
        maxValue: 100,
      },
    ],
    irrigation: [
      {
        controlType: "waterFlow",
        currentValue: 0,
        minValue: 0,
        maxValue: 10,
      },
    ],
    // Default for other device types
    default: [
      {
        controlType: "percentage",
        currentValue: 0,
        minValue: 0,
        maxValue: 100,
      },
    ],
  };

  const controls = controlsConfig[deviceType] || controlsConfig.default;

  for (const control of controls) {
    await prisma.deviceControl.create({
      data: {
        deviceId,
        ...control,
      },
    });
  }
}

// Helper function to create default triggers based on device type
async function createDefaultTriggers(deviceId: number, deviceType: string) {
  type TriggerConfig = {
    triggerType: string;
    conditionOperator: string;
    isActive: boolean;
    featurePeriod: string;
    featureDetail: string;
  }[];

  const triggersConfig: Record<string, TriggerConfig> = {
    light: [
      {
        triggerType: "Auto Lighting",
        conditionOperator: "Infrared Detection",
        isActive: false,
        featurePeriod: "Daily",
        featureDetail: "8:00pm to 7:00am",
      },
    ],
    aircond: [
      {
        triggerType: "Auto AirCond",
        conditionOperator: "Turn on when room temp > 25°C",
        isActive: false,
        featurePeriod: "Daily",
        featureDetail: "9:00pm to 4:00am",
      },
    ],
    petfeeder: [
      {
        triggerType: "Auto Feeding",
        conditionOperator: "Time-based",
        isActive: false,
        featurePeriod: "Daily",
        featureDetail: "8:00am, 12:00pm, 7:00pm",
      },
    ],
    irrigation: [
      {
        triggerType: "Auto Irrigation",
        conditionOperator: "Soil Moisture Sensor",
        isActive: false,
        featurePeriod: "Every Monday",
        featureDetail: "8:00am (10 minutes)",
      },
    ],
    // Default for other device types
    default: [
      {
        triggerType: "Auto Schedule",
        conditionOperator: "Time-based",
        isActive: false,
        featurePeriod: "Daily",
        featureDetail: "8:00am to 8:00pm",
      },
    ],
  };

  const triggers = triggersConfig[deviceType] || triggersConfig.default;

  for (const trigger of triggers) {
    await prisma.deviceTrigger.create({
      data: {
        deviceId,
        ...trigger,
      },
    });
  }
}

// DELETE device by ID - secured with authentication and home access check
router.delete("/:id", (req: Request<DeviceParams>, res: Response) => {
  try {
    const deleteDevice = async () => {
      const deviceId = parseInt(req.params.id);

      // Authentication check
      if (!req.user) {
        return res.status(401).json({ error: "Authentication required" });
      }

      const userId = req.user.id;

      // First check if the device exists and get its related room and home
      const device = await prisma.device.findUnique({
        where: { id: deviceId },
        include: {
          room: true,
        },
      });

      if (!device) {
        return res.status(404).json({ error: "Device not found" });
      }

      // Check if user has access to the home containing this device
      const hasAccess = await prisma.homeDweller.findFirst({
        where: {
          homeId: device.room.homeId,
          userId: userId,
          status: "active",
        },
      });

      if (!hasAccess) {
        return res
          .status(403)
          .json({ error: "You don't have access to delete this device" });
      }

      // Delete in the correct order to respect foreign key constraints

      // 1. First delete device controls
      await prisma.deviceControl.deleteMany({
        where: { deviceId: deviceId },
      });

      // 2. Delete device triggers
      await prisma.deviceTrigger.deleteMany({
        where: { deviceId: deviceId },
      });

      // 3. Delete energy logs
      await prisma.energyConsumptionLog.deleteMany({
        where: { deviceId: deviceId },
      });

      // 4. Delete energy breakdowns
      await prisma.energyDeviceBreakdown.deleteMany({
        where: { deviceId: deviceId },
      });

      // 5. Now we can delete the device
      const deletedDevice = await prisma.device.delete({
        where: { id: deviceId },
      });

      return res.json(deletedDevice);
    };

    deleteDevice().catch((error) => {
      console.error("Error deleting device:", error);
      res.status(500).json({
        error: "Failed to delete device",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    });
  } catch (error) {
    console.error("Error deleting device:", error);
    res.status(500).json({
      error: "Failed to delete device",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Define the router.put with authentication
router.put("/:id", verifyToken, (req: Request<DeviceParams>, res: Response) => {
  try {
    const updateDevice = async () => {
      const deviceId = parseInt(req.params.id);
      const {
        // Device fields
        displayName,
        type,
        status,
        iconType,
        isFavorite,
        swiped,
        homeId, // Get homeId from request body for validation
        // Related data
        controls, // Array of controls to update
        triggers, // Array of triggers to update
      } = req.body;

      // Authentication check (redundant with verifyToken, but good practice)
      if (!req.user) {
        return res.status(401).json({ error: "Authentication required" });
      }

      // 1. Check if device exists and get its relationship to home through room
      const existingDevice = await prisma.device.findUnique({
        where: { id: deviceId },
        include: {
          controls: true,
          triggers: true,
          room: true, // Include room to get homeId
        },
      });

      if (!existingDevice) {
        return res.status(404).json({ error: "Device not found" });
      }

      const deviceHomeId = existingDevice.room.homeId;

      // 2. If homeId was provided in request, verify it matches the device's home
      if (homeId && deviceHomeId !== homeId) {
        return res.status(403).json({
          error: "Device does not belong to the specified home",
        });
      }

      // 3. Verify the user has access to this home
      const userId = req.user.id;

      // Check if user is the home owner
      const isHomeOwner = await prisma.smartHome.findFirst({
        where: {
          id: deviceHomeId,
          homeownerId: userId,
        },
      });

      // If not owner, check if user is an active dweller
      if (!isHomeOwner) {
        const isDweller = await prisma.homeDweller.findFirst({
          where: {
            homeId: deviceHomeId,
            userId: userId,
            status: "active",
          },
        });

        if (!isDweller) {
          return res.status(403).json({
            error: "You don't have permission to access this home",
          });
        }
      }

      // 4. Update the device - only for fields that are provided
      const deviceUpdateData: any = {};
      if (displayName !== undefined) deviceUpdateData.displayName = displayName;
      if (type !== undefined) deviceUpdateData.type = type;
      if (status !== undefined) deviceUpdateData.status = status;
      if (iconType !== undefined) deviceUpdateData.iconType = iconType;
      if (isFavorite !== undefined) deviceUpdateData.isFavorite = isFavorite;
      if (swiped !== undefined) deviceUpdateData.swiped = swiped;

      let updatedDevice;
      if (Object.keys(deviceUpdateData).length > 0) {
        updatedDevice = await prisma.device.update({
          where: { id: deviceId },
          data: deviceUpdateData,
        });
      } else {
        updatedDevice = existingDevice;
      }

      // 5. Update controls if provided
      if (controls && controls.length > 0) {
        // Process each control
        for (const control of controls) {
          if (control.id) {
            // Update existing control with only the provided fields
            const controlUpdateData: any = {};

            if (control.controlType !== undefined)
              controlUpdateData.controlType = control.controlType;
            if (control.currentValue !== undefined)
              controlUpdateData.currentValue = control.currentValue;
            if (control.minValue !== undefined)
              controlUpdateData.minValue = control.minValue;
            if (control.maxValue !== undefined)
              controlUpdateData.maxValue = control.maxValue;

            // Only update if there are fields to update
            if (Object.keys(controlUpdateData).length > 0) {
              await prisma.deviceControl.update({
                where: { id: control.id },
                data: controlUpdateData,
              });
            }
          } else {
            // For new controls, all fields are required
            await prisma.deviceControl.create({
              data: {
                deviceId,
                controlType: control.controlType,
                currentValue: control.currentValue,
                minValue: control.minValue,
                maxValue: control.maxValue,
              },
            });
          }
        }
      }

      // 6. Update triggers if provided
      if (triggers && triggers.length > 0) {
        // Process each trigger
        for (const trigger of triggers) {
          if (trigger.id) {
            // Update existing trigger with only the provided fields
            const triggerUpdateData: any = {};

            if (trigger.triggerType !== undefined)
              triggerUpdateData.triggerType = trigger.triggerType;
            if (trigger.conditionOperator !== undefined)
              triggerUpdateData.conditionOperator = trigger.conditionOperator;
            if (trigger.isActive !== undefined)
              triggerUpdateData.isActive = trigger.isActive;
            if (trigger.featurePeriod !== undefined)
              triggerUpdateData.featurePeriod = trigger.featurePeriod;
            if (trigger.featureDetail !== undefined)
              triggerUpdateData.featureDetail = trigger.featureDetail;

            // Only update if there are fields to update
            if (Object.keys(triggerUpdateData).length > 0) {
              await prisma.deviceTrigger.update({
                where: { id: trigger.id },
                data: triggerUpdateData,
              });
            }
          } else {
            // For new triggers, all fields are required
            await prisma.deviceTrigger.create({
              data: {
                deviceId,
                triggerType: trigger.triggerType,
                conditionOperator: trigger.conditionOperator,
                isActive:
                  trigger.isActive !== undefined ? trigger.isActive : true,
                featurePeriod: trigger.featurePeriod || "Daily",
                featureDetail: trigger.featureDetail || "",
              },
            });
          }
        }
      }

      // 7. Log status change if necessary
      if (status !== undefined && status !== existingDevice.status) {
        await prisma.energyConsumptionLog.create({
          data: {
            deviceId: deviceId,
            actionType: status ? "turned_on" : "turned_off",
            actionDetails: `Device ${status ? "activated" : "deactivated"}`,
            timestamp: new Date(),
          },
        });
      }

      // 8. Return the updated device with its related data
      const result = await prisma.device.findUnique({
        where: { id: deviceId },
        include: {
          controls: true,
          triggers: true,
          energyLogs: {
            orderBy: {
              timestamp: "desc",
            },
            take: 10,
          },
        },
      });

      return res.json(result);
    };

    updateDevice().catch((error) => {
      console.error("Error updating device:", error);
      res
        .status(500)
        .json({ error: "Failed to update device", details: error.message });
    });
  } catch (error) {
    console.error("Error updating device:", error);
    res.status(500).json({
      error: "Failed to update device",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// GET energy consumption for all devices
router.get("/energy/consumption", (req: Request, res: Response) => {
  try {
    const getEnergyConsumption = async () => {
      const energyData = await prisma.energyConsumptionLog.findMany({
        include: {
          device: {
            select: {
              displayName: true,
              type: true,
              room: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
        orderBy: {
          timestamp: "desc",
        },
        take: 100,
      });
      return res.json(energyData);
    };

    getEnergyConsumption().catch((error) => {
      console.error("Error fetching energy consumption:", error);
      res
        .status(500)
        .json({ error: "Failed to fetch energy consumption data" });
    });
  } catch (error) {
    console.error("Error fetching energy consumption:", error);
    res.status(500).json({ error: "Failed to fetch energy consumption data" });
  }
});

// GET energy breakdown for all devices
router.get("/energy/breakdown", (req: Request, res: Response) => {
  try {
    const getEnergyBreakdown = async () => {
      const breakdown = await prisma.energyDeviceBreakdown.findMany({
        include: {
          device: {
            select: {
              displayName: true,
              type: true,
              room: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
        orderBy: {
          timestamp: "desc",
        },
      });
      return res.json(breakdown);
    };

    getEnergyBreakdown().catch((error) => {
      console.error("Error fetching energy breakdown:", error);
      res.status(500).json({ error: "Failed to fetch energy breakdown" });
    });
  } catch (error) {
    console.error("Error fetching energy breakdown:", error);
    res.status(500).json({ error: "Failed to fetch energy breakdown" });
  }
});

interface AggregatedQueryParams {
  timeRange?: string;
  aggregationType?: string;
}

router.get(
  "/energy/aggregated",
  (req: Request<{}, {}, {}, AggregatedQueryParams>, res: Response) => {
    try {
      const getAggregatedData = async () => {
        // Authentication check
        if (!req.user) {
          return res.status(401).json({ error: "Authentication required" });
        }

        const { timeRange = "week", aggregationType = "daily" } = req.query;
        let startDate: Date;

        switch (timeRange) {
          case "today":
            startDate = getStartOfDay(new Date());
            break;
          case "week":
            startDate = getStartOfWeek(new Date());
            break;
          case "month":
            startDate = getStartOfMonth(new Date());
            break;
          case "year":
            startDate = getStartOfYear(new Date());
            break;
          default:
            return res.status(400).json({ error: "Invalid time range" });
        }

        // Get all homes the user has access to
        const userId = req.user.id;
        const accessibleHomes = await prisma.homeDweller.findMany({
          where: {
            userId: userId,
            status: "active",
          },
          select: {
            homeId: true,
          },
        });

        const homeIds = accessibleHomes.map((home) => home.homeId);

        if (homeIds.length === 0) {
          return res.json({
            deviceTotals: [],
            dailyTotals: [],
          });
        }

        // Get all rooms in the accessible homes
        const rooms = await prisma.room.findMany({
          where: {
            homeId: {
              in: homeIds,
            },
          },
          select: {
            id: true,
          },
        });

        const roomIds = rooms.map((room) => room.id);

        // Only fetch breakdowns for devices in rooms the user has access to
        const breakdown = await prisma.energyDeviceBreakdown.findMany({
          where: {
            timestamp: { gte: startDate },
            device: {
              roomId: {
                in: roomIds,
              },
            },
          },
          include: {
            device: {
              select: {
                displayName: true,
                type: true,
                room: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        });

        const deviceTotals = aggregateDeviceTotals(breakdown, timeRange);
        const dailyTotals = aggregateDailyTotals(breakdown, timeRange);

        return res.json({
          deviceTotals,
          dailyTotals,
        });
      };

      getAggregatedData().catch((error) => {
        console.error("Error fetching aggregated energy data:", error);
        res
          .status(500)
          .json({ error: "Failed to fetch aggregated energy data" });
      });
    } catch (error) {
      console.error("Error fetching aggregated energy data:", error);
      res.status(500).json({ error: "Failed to fetch aggregated energy data" });
    }
  }
);

function getStartOfDay(date: Date): Date {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  return startOfDay;
}

function getStartOfWeek(date: Date): Date {
  const startOfWeek = new Date(date);
  startOfWeek.setDate(
    date.getDate() - date.getDay() + (date.getDay() === 0 ? -6 : 1)
  );
  startOfWeek.setHours(0, 0, 0, 0);
  return startOfWeek;
}

function getStartOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0, 0);
}

function getStartOfYear(date: Date): Date {
  return new Date(date.getFullYear(), 0, 1, 0, 0, 0, 0);
}

function aggregateDeviceTotals(
  breakdown: any[],
  timeRange: string
): {
  name: string;
  type: string;
  room: string;
  value: number;
  activeHours: number;
  previousValue?: number;
  previousActiveHours?: number;
}[] {
  const deviceTotalsMap = new Map<
    string,
    {
      type: string;
      room: string;
      currentValue: number;
      currentActiveHours: number;
      previousValue: number;
      previousActiveHours: number;
    }
  >();

  const currentDate = new Date();
  let comparisonDate: Date;

  // Determine comparison date based on timeRange
  switch (timeRange) {
    case "today":
      comparisonDate = new Date(currentDate);
      comparisonDate.setDate(currentDate.getDate() - 1);
      break;
    case "week":
      comparisonDate = new Date(currentDate);
      comparisonDate.setDate(currentDate.getDate() - 7);
      break;
    case "month":
      comparisonDate = new Date(currentDate);
      comparisonDate.setMonth(currentDate.getMonth() - 1);
      break;
    case "year":
      comparisonDate = new Date(currentDate);
      comparisonDate.setFullYear(currentDate.getFullYear() - 1);
      break;
    default:
      comparisonDate = new Date(currentDate);
      comparisonDate.setDate(currentDate.getDate() - 1); // Default to daily comparison
  }

  breakdown.forEach((log) => {
    const deviceName = log.device.displayName;
    const deviceType = log.device.type;
    const roomName = log.device.room.name;
    const energyUsed = Number(log.energyUsed);
    const activeHours = Number(log.activeHours);
    const logDate = new Date(log.timestamp);

    if (!deviceTotalsMap.has(deviceName)) {
      deviceTotalsMap.set(deviceName, {
        type: deviceType,
        room: roomName,
        currentValue: 0,
        currentActiveHours: 0,
        previousValue: 0,
        previousActiveHours: 0,
      });
    }

    const deviceData = deviceTotalsMap.get(deviceName)!;

    if (logDate >= comparisonDate && logDate < currentDate) {
      deviceData.currentValue += energyUsed;
      deviceData.currentActiveHours += activeHours;
    } else {
      deviceData.previousValue += energyUsed;
      deviceData.previousActiveHours += activeHours;
    }
  });

  return Array.from(deviceTotalsMap, ([name, data]) => ({
    name,
    type: data.type,
    room: data.room,
    value: Number(data.currentValue.toFixed(2)),
    activeHours: Number(data.currentActiveHours.toFixed(1)),
    previousValue: Number(data.previousValue.toFixed(2)),
    previousActiveHours: Number(data.previousActiveHours.toFixed(1)),
  }));
}

function aggregateDailyTotals(
  breakdown: any[],
  timeRange: string
): { day: string; total: number }[] {
  if (timeRange === "week") {
    const dailyTotals: Record<string, number> = {};
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    days.forEach((day) => {
      dailyTotals[day] = 0;
    });

    breakdown.forEach((log) => {
      const date = new Date(log.timestamp);
      const day = date.toLocaleDateString("en-US", { weekday: "short" });
      if (days.includes(day)) {
        dailyTotals[day] += Number(log.energyUsed);
      }
    });

    return days.map((day) => ({
      day,
      total: Number(dailyTotals[day].toFixed(2)),
    }));
  }

  if (timeRange === "month") {
    const weeklyTotals: Record<string, number> = {
      "Week 1": 0,
      "Week 2": 0,
      "Week 3": 0,
      "Week 4": 0,
    };

    breakdown.forEach((log) => {
      const date = new Date(log.timestamp);
      const weekOfMonth = Math.floor((date.getDate() - 1) / 7) + 1;
      weeklyTotals[`Week ${weekOfMonth}`] += Number(log.energyUsed);
    });

    return Object.entries(weeklyTotals).map(([day, total]) => ({
      day,
      total: Number(total.toFixed(2)),
    }));
  }

  if (timeRange === "year") {
    const monthlyTotals: Record<string, number> = {};
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    breakdown.forEach((log) => {
      const date = new Date(log.timestamp);
      const monthName = monthNames[date.getMonth()];
      monthlyTotals[monthName] =
        (monthlyTotals[monthName] || 0) + Number(log.energyUsed);
    });

    return monthNames.map((month) => ({
      day: month,
      total: Number((monthlyTotals[month] || 0).toFixed(2)),
    }));
  }

  return [];
}

// POST new trigger for a specific device
router.post(
  "/:deviceId/triggers",
  verifyToken,
  (req: Request, res: Response) => {
    try {
      const createDeviceTrigger = async () => {
        const deviceId = parseInt(req.params.deviceId);
        const {
          triggerType,
          conditionOperator,
          isActive,
          featurePeriod,
          featureDetail,
          homeId, // For validation
        } = req.body;

        // Validate required fields
        if (!triggerType || !conditionOperator || isActive === undefined) {
          return res.status(400).json({
            error: "Missing required fields",
            required: ["triggerType", "conditionOperator", "isActive"],
          });
        }

        // Authentication check
        if (!req.user) {
          return res.status(401).json({ error: "Authentication required" });
        }

        const userId = req.user.id;

        // Check if device exists and get its related room and home
        const device = await prisma.device.findUnique({
          where: { id: deviceId },
          include: {
            room: true,
          },
        });

        if (!device) {
          return res.status(404).json({ error: "Device not found" });
        }

        // Check if the homeId matches the device's home
        if (homeId && device.room.homeId !== homeId) {
          return res.status(403).json({
            error: "Device does not belong to the specified home",
          });
        }

        // Check if user has access to the home containing this device
        const hasAccess = await prisma.homeDweller.findFirst({
          where: {
            homeId: device.room.homeId,
            userId: userId,
            status: "active",
          },
        });

        if (!hasAccess) {
          return res.status(403).json({
            error: "You don't have permission to modify this device",
          });
        }

        // Create the new device trigger
        const newTrigger = await prisma.deviceTrigger.create({
          data: {
            deviceId,
            triggerType,
            conditionOperator,
            isActive,
            featurePeriod: featurePeriod || "Daily",
            featureDetail: featureDetail || "",
          },
        });

        return res.status(201).json(newTrigger);
      };

      createDeviceTrigger().catch((error) => {
        console.error("Error creating device trigger:", error);
        res.status(500).json({
          error: "Failed to create device trigger",
          details: error instanceof Error ? error.message : "Unknown error",
        });
      });
    } catch (error) {
      console.error("Error creating device trigger:", error);
      res.status(500).json({
        error: "Failed to create device trigger",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
);

// PUT update a device trigger status (changed from PATCH)
router.put(
  "/:deviceId/triggers/:triggerId",
  verifyToken,
  (req: Request, res: Response) => {
    try {
      const updateTriggerStatus = async () => {
        const deviceId = parseInt(req.params.deviceId);
        const triggerId = parseInt(req.params.triggerId);
        const { isActive, homeId } = req.body;

        // Validate required fields
        if (isActive === undefined) {
          return res.status(400).json({
            error: "Missing required field",
            required: ["isActive"],
          });
        }

        // Authentication check
        if (!req.user) {
          return res.status(401).json({ error: "Authentication required" });
        }

        const userId = req.user.id;

        // Check if trigger exists and get its related device, room and home
        const trigger = await prisma.deviceTrigger.findUnique({
          where: { id: triggerId },
          include: {
            device: {
              include: {
                room: true,
              },
            },
          },
        });

        if (!trigger) {
          return res.status(404).json({ error: "Device trigger not found" });
        }

        // Check if the deviceId in the URL matches the trigger's deviceId
        if (trigger.deviceId !== deviceId) {
          return res.status(400).json({
            error: "Trigger does not belong to the specified device",
          });
        }

        // Check if the homeId matches the device's home
        if (homeId && trigger.device.room.homeId !== homeId) {
          return res.status(403).json({
            error: "Device does not belong to the specified home",
          });
        }

        // Check if user has access to the home containing this device
        const hasAccess = await prisma.homeDweller.findFirst({
          where: {
            homeId: trigger.device.room.homeId,
            userId: userId,
            status: "active",
          },
        });

        if (!hasAccess) {
          return res.status(403).json({
            error: "You don't have permission to modify this device",
          });
        }

        // Update the trigger status
        const updatedTrigger = await prisma.deviceTrigger.update({
          where: { id: triggerId },
          data: { isActive },
        });

        return res.json(updatedTrigger);
      };

      updateTriggerStatus().catch((error) => {
        console.error("Error updating device trigger:", error);
        res.status(500).json({
          error: "Failed to update device trigger",
          details: error instanceof Error ? error.message : "Unknown error",
        });
      });
    } catch (error) {
      console.error("Error updating device trigger:", error);
      res.status(500).json({
        error: "Failed to update device trigger",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
);

export default router;
