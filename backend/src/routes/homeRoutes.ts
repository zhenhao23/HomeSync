//homeRoutes.ts
import { Router, Request, Response } from "express";
import prisma from "../prisma";

const router = Router();

// GET all homes
router.get("/", (req: Request, res: Response) => {
  try {
    const getAllHomes = async () => {
      const homes = await prisma.smartHome.findMany({
        select: { id: true, name: true },
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

// POST route to create a home
router.post("/", (req: Request, res: Response) => {
  try {
    const createHome = async () => {
      // Create a user first if you don't have any
      const user = await prisma.user.findFirst();

      if (!user) {
        return res
          .status(404)
          .json({ error: "No users found. Create a user first." });
      }

      const home = await prisma.smartHome.create({
        data: {
          name: "Test Home",
          invitationCode: "TEST" + Date.now(), // Generate a unique code
          homeownerId: user.id,
        },
      });

      return res.status(201).json(home);
    };

    createHome().catch((error) => {
      console.error("Error creating home:", error);
      res.status(500).json({
        error: "Failed to create home",
        details: error.message,
      });
    });
  } catch (error) {
    console.error("Error creating home:", error);
    res.status(500).json({
      error: "Failed to create home",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export default router;
