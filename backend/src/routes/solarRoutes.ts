import { Router, Request, Response } from "express";
import prisma from "../prisma";
import { verifyToken } from "../../firebase/middleware/authMiddleware";

const router = Router();

// Debug route for energy metrics (without authentication)
// Place this BEFORE applying global authentication
router.get("/debug/metrics/:homeId", (req: Request, res: Response) => {
  try {
    const getMetrics = async () => {
      const homeId = parseInt(req.params.homeId);

      if (isNaN(homeId)) {
        return res.status(400).json({ error: "Invalid home ID" });
      }

      const latestMetrics = await prisma.solarEnergyMetric.findFirst({
        where: { homeId },
        orderBy: { recordedDate: "desc" },
      });

      return res.json(latestMetrics || { error: "No metrics found" });
    };

    getMetrics().catch((error) => {
      console.error("Error in debug route:", error);
      res.status(500).json({
        error: "Debug route error",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    });
  } catch (error) {
    console.error("Error in debug route:", error);
    res.status(500).json({
      error: "Debug route error",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Debug route for energy flow data
router.get("/debug/energy-flow/:homeId", (req: Request, res: Response) => {
  try {
    const getEnergyFlow = async () => {
      const homeId = parseInt(req.params.homeId);

      if (isNaN(homeId)) {
        return res.status(400).json({ error: "Invalid home ID" });
      }

      // Remove the user access check since this is a debug route
      // and req.user is undefined before the verifyToken middleware

      // Get today's data (most recent)
      const todayData = await prisma.solarEnergyDetail.findFirst({
        where: { homeId },
        orderBy: { recordedDate: "desc" },
      });

      // Calculate monthly data (sum of last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      // Define type for query results
      interface EnergyFlowAggregate {
        pvGeneration: number | string | null;
        importedEnergy: number | string | null;
        exportedEnergy: number | string | null;
        loadEnergy: number | string | null;
      }

      const monthlyData = await prisma.$queryRaw<EnergyFlowAggregate[]>`
        SELECT 
          SUM("pvGeneration") as "pvGeneration",
          SUM("importedEnergy") as "importedEnergy",
          SUM("exportedEnergy") as "exportedEnergy",
          SUM("loadEnergy") as "loadEnergy"
        FROM "SolarEnergyDetail"
        WHERE "homeId" = ${homeId}
        AND "recordedDate" >= ${thirtyDaysAgo}
      `;

      // Calculate total data (sum of all records)
      const totalData = await prisma.$queryRaw<EnergyFlowAggregate[]>`
        SELECT 
          SUM("pvGeneration") as "pvGeneration",
          SUM("importedEnergy") as "importedEnergy",
          SUM("exportedEnergy") as "exportedEnergy",
          SUM("loadEnergy") as "loadEnergy"
        FROM "SolarEnergyDetail"
        WHERE "homeId" = ${homeId}
      `;

      // Helper function to parse numeric values safely
      const parseNumericValue = (value: string | number | null): number => {
        if (value === null) return 0;
        const parsed = typeof value === "string" ? parseFloat(value) : value;
        return isNaN(parsed) ? 0 : parsed;
      };

      // Process the aggregated data
      const processAggregateData = (
        data: EnergyFlowAggregate | undefined
      ): {
        pvGeneration: number;
        importedEnergy: number;
        exportedEnergy: number;
        loadEnergy: number;
      } => {
        if (!data) {
          return {
            pvGeneration: 0,
            importedEnergy: 0,
            exportedEnergy: 0,
            loadEnergy: 0,
          };
        }

        return {
          pvGeneration: parseNumericValue(data.pvGeneration),
          importedEnergy: parseNumericValue(data.importedEnergy),
          exportedEnergy: parseNumericValue(data.exportedEnergy),
          loadEnergy: parseNumericValue(data.loadEnergy),
        };
      };

      const defaultDetail = {
        pvGeneration: 0,
        importedEnergy: 0,
        exportedEnergy: 0,
        loadEnergy: 0,
      };

      const energyFlowData = {
        today: todayData || defaultDetail,
        monthly: processAggregateData(monthlyData[0]),
        total: processAggregateData(totalData[0]),
      };

      return res.json(energyFlowData);
    };

    getEnergyFlow().catch((error) => {
      console.error("Error fetching energy flow data:", error);
      res.status(500).json({
        error: "Failed to fetch energy flow data",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    });
  } catch (error) {
    console.error("Error fetching energy flow data:", error);
    res.status(500).json({
      error: "Failed to fetch energy flow data",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Apply authentication to all solar routes (except debug routes)
router.use(verifyToken);

// GET latest solar metrics for a home
router.get("/metrics/:homeId", (req: Request, res: Response) => {
  try {
    const getMetrics = async () => {
      const homeId = parseInt(req.params.homeId);

      if (isNaN(homeId)) {
        return res.status(400).json({ error: "Invalid home ID" });
      }

      // Check if user has access to this home
      const hasAccess = await prisma.homeDweller.findFirst({
        where: {
          homeId: homeId,
          userId: req.user!.id,
          status: "active",
        },
      });

      if (!hasAccess) {
        return res
          .status(403)
          .json({ error: "You don't have access to this home" });
      }

      // Get the latest solar metrics
      const latestMetrics = await prisma.solarEnergyMetric.findFirst({
        where: { homeId },
        orderBy: { recordedDate: "desc" },
      });

      if (!latestMetrics) {
        return res
          .status(404)
          .json({ error: "No solar metrics found for this home" });
      }

      return res.json(latestMetrics);
    };

    getMetrics().catch((error) => {
      console.error("Error fetching solar metrics:", error);
      res.status(500).json({
        error: "Failed to fetch solar metrics",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    });
  } catch (error) {
    console.error("Error fetching solar metrics:", error);
    res.status(500).json({
      error: "Failed to fetch solar metrics",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// GET energy flow data for a home (daily, monthly, total)
router.get("/energy-flow/:homeId", (req: Request, res: Response) => {
  try {
    const getEnergyFlow = async () => {
      const homeId = parseInt(req.params.homeId);

      if (isNaN(homeId)) {
        return res.status(400).json({ error: "Invalid home ID" });
      }

      // Check if user has access to this home
      const hasAccess = await prisma.homeDweller.findFirst({
        where: {
          homeId: homeId,
          userId: req.user!.id,
          status: "active",
        },
      });

      if (!hasAccess) {
        return res
          .status(403)
          .json({ error: "You don't have access to this home" });
      }

      // Get today's data (most recent)
      const todayData = await prisma.solarEnergyDetail.findFirst({
        where: { homeId },
        orderBy: { recordedDate: "desc" },
      });

      // Calculate monthly data (sum of last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      // Define type for query results
      interface EnergyFlowAggregate {
        pvGeneration: number | string | null;
        importedEnergy: number | string | null;
        exportedEnergy: number | string | null;
        loadEnergy: number | string | null;
      }

      const monthlyData = await prisma.$queryRaw<EnergyFlowAggregate[]>`
        SELECT 
          SUM("pvGeneration") as "pvGeneration",
          SUM("importedEnergy") as "importedEnergy",
          SUM("exportedEnergy") as "exportedEnergy",
          SUM("loadEnergy") as "loadEnergy"
        FROM "SolarEnergyDetail"
        WHERE "homeId" = ${homeId}
        AND "recordedDate" >= ${thirtyDaysAgo}
      `;

      // Calculate total data (sum of all records)
      const totalData = await prisma.$queryRaw<EnergyFlowAggregate[]>`
        SELECT 
          SUM("pvGeneration") as "pvGeneration",
          SUM("importedEnergy") as "importedEnergy",
          SUM("exportedEnergy") as "exportedEnergy",
          SUM("loadEnergy") as "loadEnergy"
        FROM "SolarEnergyDetail"
        WHERE "homeId" = ${homeId}
      `;

      // Helper function to parse numeric values safely
      const parseNumericValue = (value: string | number | null): number => {
        if (value === null) return 0;
        const parsed = typeof value === "string" ? parseFloat(value) : value;
        return isNaN(parsed) ? 0 : parsed;
      };

      // Process the aggregated data
      const processAggregateData = (
        data: EnergyFlowAggregate | undefined
      ): {
        pvGeneration: number;
        importedEnergy: number;
        exportedEnergy: number;
        loadEnergy: number;
      } => {
        if (!data) {
          return {
            pvGeneration: 0,
            importedEnergy: 0,
            exportedEnergy: 0,
            loadEnergy: 0,
          };
        }

        return {
          pvGeneration: parseNumericValue(data.pvGeneration),
          importedEnergy: parseNumericValue(data.importedEnergy),
          exportedEnergy: parseNumericValue(data.exportedEnergy),
          loadEnergy: parseNumericValue(data.loadEnergy),
        };
      };

      const defaultDetail = {
        pvGeneration: 0,
        importedEnergy: 0,
        exportedEnergy: 0,
        loadEnergy: 0,
      };

      const energyFlowData = {
        today: todayData || defaultDetail,
        monthly: processAggregateData(monthlyData[0]),
        total: processAggregateData(totalData[0]),
      };

      return res.json(energyFlowData);
    };

    getEnergyFlow().catch((error) => {
      console.error("Error fetching energy flow data:", error);
      res.status(500).json({
        error: "Failed to fetch energy flow data",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    });
  } catch (error) {
    console.error("Error fetching energy flow data:", error);
    res.status(500).json({
      error: "Failed to fetch energy flow data",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export default router;
