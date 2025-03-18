import { Router, Request, Response } from "express";
import prisma from "../prisma";

const router = Router();

// GET all dwellers
router.get("/", (req: Request, res: Response) => {
  try {
    const getAllDwellers = async () => {
      const dwellers = await prisma.homeDweller.findMany({
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              profilePictureUrl: true,
            },
          },
          home: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
      return res.json(dwellers);
    };

    getAllDwellers().catch((error) => {
      console.error("Error fetching dwellers:", error);
      res.status(500).json({ error: "Failed to fetch dwellers" });
    });
  } catch (error) {
    console.error("Error fetching dwellers:", error);
    res.status(500).json({ error: "Failed to fetch dwellers" });
  }
});

// GET dwellers by homeId
router.get("/home/:homeId", (req: Request, res: Response) => {
  try {
    const getDwellersByHome = async () => {
      const homeId = parseInt(req.params.homeId);

      if (isNaN(homeId)) {
        return res.status(400).json({ error: "Invalid home ID" });
      }

      const dwellers = await prisma.homeDweller.findMany({
        where: {
          homeId: homeId,
        },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              profilePictureUrl: true,
            },
          },
        },
        orderBy: {
          addedAt: "desc",
        },
      });

      return res.json(dwellers);
    };

    getDwellersByHome().catch((error) => {
      console.error("Error fetching dwellers:", error);
      res.status(500).json({
        error: "Failed to fetch dwellers",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    });
  } catch (error) {
    console.error("Error fetching dwellers:", error);
    res.status(500).json({
      error: "Failed to fetch dwellers",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// GET dweller by id
router.get("/:id", (req: Request, res: Response) => {
  try {
    const getDwellerById = async () => {
      const dwellerId = parseInt(req.params.id);

      if (isNaN(dwellerId)) {
        return res.status(400).json({ error: "Invalid dweller ID" });
      }

      const dweller = await prisma.homeDweller.findUnique({
        where: {
          id: dwellerId,
        },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              profilePictureUrl: true,
            },
          },
          home: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      if (!dweller) {
        return res.status(404).json({ error: "Dweller not found" });
      }

      return res.json(dweller);
    };

    getDwellerById().catch((error) => {
      console.error("Error fetching dweller:", error);
      res.status(500).json({
        error: "Failed to fetch dweller",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    });
  } catch (error) {
    console.error("Error fetching dweller:", error);
    res.status(500).json({
      error: "Failed to fetch dweller",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// POST new dweller
router.post("/", (req: Request, res: Response) => {
  try {
    const createDweller = async () => {
      const {
        userId,
        homeId,
        permissionLevel = "standard",
        status = "active",
      } = req.body;

      if (!userId || !homeId) {
        return res
          .status(400)
          .json({ error: "userId and homeId are required" });
      }

      // Check if user exists
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Check if home exists
      const home = await prisma.smartHome.findUnique({
        where: { id: homeId },
      });

      if (!home) {
        return res.status(404).json({ error: "Home not found" });
      }

      // Check if dweller already exists for this user and home
      const existingDweller = await prisma.homeDweller.findFirst({
        where: {
          userId: userId,
          homeId: homeId,
        },
      });

      if (existingDweller) {
        return res
          .status(400)
          .json({ error: "User is already a dweller in this home" });
      }

      // Create the dweller
      const dweller = await prisma.homeDweller.create({
        data: {
          userId: userId,
          homeId: homeId,
          permissionLevel: permissionLevel,
          status: status,
        },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
            },
          },
          home: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      return res.status(201).json(dweller);
    };

    createDweller().catch((error) => {
      console.error("Error creating dweller:", error);
      res.status(500).json({
        error: "Failed to create dweller",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    });
  } catch (error) {
    console.error("Error creating dweller:", error);
    res.status(500).json({
      error: "Failed to create dweller",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// PUT update dweller
router.put("/:id", (req: Request, res: Response) => {
  try {
    const updateDweller = async () => {
      const dwellerId = parseInt(req.params.id);
      const { permissionLevel, status } = req.body;

      if (isNaN(dwellerId)) {
        return res.status(400).json({ error: "Invalid dweller ID" });
      }

      const existingDweller = await prisma.homeDweller.findUnique({
        where: { id: dwellerId },
      });

      if (!existingDweller) {
        return res.status(404).json({ error: "Dweller not found" });
      }

      // Only update fields that are provided
      const updateData: any = {};
      if (permissionLevel !== undefined)
        updateData.permissionLevel = permissionLevel;
      if (status !== undefined) updateData.status = status;

      if (Object.keys(updateData).length === 0) {
        return res.status(400).json({ error: "No fields to update" });
      }

      const updatedDweller = await prisma.homeDweller.update({
        where: { id: dwellerId },
        data: updateData,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
            },
          },
          home: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      return res.json(updatedDweller);
    };

    updateDweller().catch((error) => {
      console.error("Error updating dweller:", error);
      res.status(500).json({
        error: "Failed to update dweller",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    });
  } catch (error) {
    console.error("Error updating dweller:", error);
    res.status(500).json({
      error: "Failed to update dweller",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// DELETE dweller
router.delete("/:id", (req: Request, res: Response) => {
  try {
    const deleteDweller = async () => {
      const dwellerId = parseInt(req.params.id);

      if (isNaN(dwellerId)) {
        return res.status(400).json({ error: "Invalid dweller ID" });
      }

      const existingDweller = await prisma.homeDweller.findUnique({
        where: { id: dwellerId },
      });

      if (!existingDweller) {
        return res.status(404).json({ error: "Dweller not found" });
      }

      // Delete the dweller
      const deletedDweller = await prisma.homeDweller.delete({
        where: { id: dwellerId },
      });

      return res.json({
        message: "Dweller removed successfully",
        dweller: deletedDweller,
      });
    };

    deleteDweller().catch((error) => {
      console.error("Error deleting dweller:", error);
      res.status(500).json({
        error: "Failed to delete dweller",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    });
  } catch (error) {
    console.error("Error deleting dweller:", error);
    res.status(500).json({
      error: "Failed to delete dweller",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// GET users by homeId (formatted for the ProfilePage component)
router.get("/home/:homeId/users", (req: Request, res: Response) => {
  try {
    const getUsersByHome = async () => {
      const homeId = parseInt(req.params.homeId);

      if (isNaN(homeId)) {
        return res.status(400).json({ error: "Invalid home ID" });
      }

      // Get the home to verify it exists
      const home = await prisma.smartHome.findUnique({
        where: { id: homeId },
      });

      if (!home) {
        return res.status(404).json({ error: "Home not found" });
      }

      // Get all dwellers with their user information
      const dwellers = await prisma.homeDweller.findMany({
        where: {
          homeId: homeId,
          status: "active", // Only get active users
        },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              profilePictureUrl: true,
            },
          },
        },
        orderBy: {
          permissionLevel: "asc", // Order by permission level - OWNER first
        },
      });

      // Custom mapping for profile pictures based on user emails
      const getProfilePic = (email: string, defaultPic: string | null) => {
        // If there's already a valid profile picture, use it
        if (defaultPic && defaultPic.startsWith("/")) {
          return defaultPic;
        }

        // Otherwise map based on email
        switch (email) {
          case "alice@example.com":
            return "/img1.jpeg";
          case "anna@example.com":
            return "/anna-profile.avif";
          case "adrian@example.com":
            return "/adrian-profile.avif";
          case "joshua@example.com":
            return "/joshua-profile.avif";
          case "lily@example.com":
            return "/lily-profile.avif";
          default:
            return "/img1.jpeg"; // Default image
        }
      };

      // Format the response for the ProfilePage component
      const formattedUsers = dwellers.map((dweller) => {
        const fullName =
          dweller.user.firstName +
          (dweller.user.lastName ? " " + dweller.user.lastName : "");

        // Mark the owner with "(You)" if applicable
        const displayName =
          dweller.permissionLevel === "OWNER" ? `${fullName} (You)` : fullName;

        return {
          id: dweller.user.id,
          name: displayName,
          profilePic: getProfilePic(
            dweller.user.email,
            dweller.user.profilePictureUrl
          ),
          email: dweller.user.email,
          permissionLevel: dweller.permissionLevel,
        };
      });

      return res.json(formattedUsers);
    };

    getUsersByHome().catch((error) => {
      console.error("Error fetching home users:", error);
      res.status(500).json({
        error: "Failed to fetch home users",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    });
  } catch (error) {
    console.error("Error fetching home users:", error);
    res.status(500).json({
      error: "Failed to fetch home users",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export default router;
