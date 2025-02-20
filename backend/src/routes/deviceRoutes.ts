import { Router, Request, Response } from "express";
import prisma from "../prisma";

const router = Router();

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

        const breakdown = await prisma.energyDeviceBreakdown.findMany({
          where: {
            timestamp: { gte: startDate },
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

export default router;
