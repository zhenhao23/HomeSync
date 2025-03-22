import { Router, Request, Response } from "express";
import prisma from "../prisma";
import { verifyToken } from "../../firebase/middleware/authMiddleware";

const router = Router();

// Apply authentication to all routes
router.use(verifyToken);

// GET the current energy limit for a home
router.get("/:homeId", (req: Request, res: Response) => {
  try {
    const getEnergyLimit = async () => {
      const homeId = parseInt(req.params.homeId);

      if (isNaN(homeId)) {
        return res.status(400).json({ error: "Invalid home ID" });
      }

      // Authentication check
      if (!req.user) {
        return res.status(401).json({ error: "Authentication required" });
      }

      const userId = req.user.id;

      // Check if user has access to this home
      const hasAccess = await prisma.homeDweller.findFirst({
        where: {
          homeId: homeId,
          userId: userId,
          status: "active",
        },
      });

      if (!hasAccess) {
        return res
          .status(403)
          .json({ error: "You don't have access to this home" });
      }

      // Get the home with its energy limit
      const home = await prisma.smartHome.findUnique({
        where: { id: homeId },
        select: { energyLimit: true },
      });

      if (!home) {
        return res.status(404).json({ error: "Home not found" });
      }

      return res.json({
        energyLimit: home.energyLimit,
        timeframe: "monthly", // Default timeframe
      });
    };

    // Execute the async function with proper error handling
    getEnergyLimit().catch((error) => {
      console.error("Error fetching energy limit:", error);
      res.status(500).json({
        error: "Failed to fetch energy limit",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    });
  } catch (error) {
    console.error("Error in energy limit route:", error);
    res.status(500).json({
      error: "Server error while processing energy limit request",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// UPDATE the energy limit for a home
router.post("/:homeId", (req: Request, res: Response) => {
  try {
    const updateEnergyLimit = async () => {
      const homeId = parseInt(req.params.homeId);
      const { energyLimit, timeframe } = req.body;

      if (isNaN(homeId)) {
        return res.status(400).json({ error: "Invalid home ID" });
      }

      if (isNaN(parseFloat(energyLimit)) || parseFloat(energyLimit) <= 0) {
        return res.status(400).json({ error: "Invalid energy limit value" });
      }

      // Authentication check
      if (!req.user) {
        return res.status(401).json({ error: "Authentication required" });
      }

      const userId = req.user.id;

      // Check if user has access to this home
      const hasAccess = await prisma.homeDweller.findFirst({
        where: {
          homeId: homeId,
          userId: userId,
          status: "active",
        },
      });

      if (!hasAccess) {
        return res
          .status(403)
          .json({ error: "You don't have access to this home" });
      }

      // Update the energy limit for the home
      const updatedHome = await prisma.smartHome.update({
        where: { id: homeId },
        data: {
          energyLimit: parseFloat(energyLimit),
          // You could store the timeframe in a separate field if needed
        },
      });

      return res.json({
        message: "Energy limit updated successfully",
        energyLimit: updatedHome.energyLimit,
        timeframe: timeframe || "monthly",
      });
    };

    // Execute the async function with proper error handling
    updateEnergyLimit().catch((error) => {
      console.error("Error updating energy limit:", error);
      res.status(500).json({
        error: "Failed to update energy limit",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    });
  } catch (error) {
    console.error("Error in energy limit update route:", error);
    res.status(500).json({
      error: "Server error while processing energy limit update request",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export default router;
