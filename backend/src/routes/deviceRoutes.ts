// deviceRoutes.ts
import express from "express";
import prisma from "../prisma";

const router = express.Router();

// GET energy consumption for all devices
router.get("/energy/consumption", async (req, res) => {
  try {
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
      take: 100, // Limit to recent entries
    });
    res.json(energyData);
  } catch (error) {
    console.error("Error fetching energy consumption:", error);
    res.status(500).json({ error: "Failed to fetch energy consumption data" });
  }
});

// GET energy breakdown for all devices
router.get("/energy/breakdown", async (req, res) => {
  try {
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
    res.json(breakdown);
  } catch (error) {
    console.error("Error fetching energy breakdown:", error);
    res.status(500).json({ error: "Failed to fetch energy breakdown" });
  }
});

router.get("/energy/aggregated", async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get start of week (Monday)
    const startOfWeek = new Date(today);
    startOfWeek.setDate(
      today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1)
    );

    // Get today's device breakdown
    const todayBreakdown = await prisma.energyDeviceBreakdown.findMany({
      where: {
        timestamp: {
          gte: today,
        },
      },
      include: {
        device: {
          select: {
            displayName: true,
            type: true,
          },
        },
      },
    });

    // Get weekly device breakdowns
    const weeklyBreakdown = await prisma.energyDeviceBreakdown.findMany({
      where: {
        timestamp: {
          gte: startOfWeek,
        },
      },
      include: {
        device: {
          select: {
            displayName: true,
            type: true,
          },
        },
      },
      orderBy: {
        timestamp: "asc",
      },
    });

    // Process data for pie chart (today's device totals)
    const deviceTotals = todayBreakdown.map((log) => ({
      name: log.device.displayName,
      value: Number(log.energyUsed.toFixed(2)),
    }));

    // Initialize dailyTotals with all weekdays set to 0
    const dailyTotals: Record<string, number> = {};
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    days.forEach((day) => {
      dailyTotals[day] = 0;
    });

    // Group logs by day and sum energyUsed
    weeklyBreakdown.forEach((log) => {
      const date = new Date(log.timestamp);
      const day = date.toLocaleDateString("en-US", { weekday: "short" });
      if (days.includes(day)) {
        dailyTotals[day] += Number(log.energyUsed);
      }
    });

    const formattedDailyTotals = days.map((day) => ({
      day,
      total: Number(dailyTotals[day].toFixed(2)),
    }));

    res.json({
      deviceTotals,
      dailyTotals: formattedDailyTotals,
    });
  } catch (error) {
    console.error("Error fetching aggregated energy data:", error);
    res.status(500).json({ error: "Failed to fetch aggregated energy data" });
  }
});

export default router;
