import { Router, Request, Response, NextFunction } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import prisma from "../prisma";
import {
  verifyToken,
  verifyHomeAccess,
  checkHomeAccess,
} from "../../firebase/middleware/authMiddleware";

const router = Router();

// Updated interface to fix the type error
interface RoomParams extends ParamsDictionary {
  id: string;
  homeId: string;
}

// Apply authentication to all room routes
router.use(verifyToken);

// GET all rooms for a specific home
router.get("/home/:homeId", verifyToken, (req: Request, res: Response) => {
  try {
    const getRooms = async () => {
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

      // User has access, fetch rooms
      const rooms = await prisma.room.findMany({
        where: { homeId },
        include: {
          devices: {
            include: {
              controls: true,
              triggers: true,
            },
          },
        },
      });

      return res.json(rooms);
    };

    getRooms().catch((error) => {
      console.error("Error fetching rooms:", error);
      res.status(500).json({
        error: "Failed to fetch rooms",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    });
  } catch (error) {
    console.error("Error fetching rooms:", error);
    res.status(500).json({
      error: "Failed to fetch rooms",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// GET room by ID
router.get("/:id", verifyToken, (req: Request<RoomParams>, res: Response) => {
  try {
    const getRoom = async () => {
      const roomId = parseInt(req.params.id);

      // First, get the room to check its homeId
      const roomInfo = await prisma.room.findUnique({
        where: { id: roomId },
        select: { homeId: true },
      });

      if (!roomInfo) {
        return res.status(404).json({ error: "Room not found" });
      }

      // Check if user has access to the room's home
      const hasAccess = await prisma.homeDweller.findFirst({
        where: {
          homeId: roomInfo.homeId,
          userId: req.user!.id,
          status: "active",
        },
      });

      if (!hasAccess) {
        return res
          .status(403)
          .json({ error: "You don't have access to this room" });
      }

      // User has access, fetch the room
      const room = await prisma.room.findUnique({
        where: { id: roomId },
        include: {
          devices: {
            include: {
              controls: true,
              energyLogs: {
                orderBy: { timestamp: "desc" },
                take: 1,
              },
            },
          },
        },
      });

      if (!room) {
        return res.status(404).json({ error: "Room not found" });
      }

      return res.json(room);
    };

    getRoom().catch((error) => {
      console.error("Error fetching room:", error);
      res.status(500).json({
        error: "Failed to fetch room",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    });
  } catch (error) {
    console.error("Error fetching room:", error);
    res.status(500).json({
      error: "Failed to fetch room",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// DELETE room by ID - Simplify validation
router.delete("/:id", (req: Request<RoomParams>, res: Response) => {
  try {
    const deleteRoom = async () => {
      const roomId = parseInt(req.params.id);

      // First check if the room exists and get its homeId
      const room = await prisma.room.findUnique({
        where: { id: roomId },
        include: { devices: true },
      });

      if (!room) {
        return res.status(404).json({ error: "Room not found" });
      }

      // Check if user has access to the room's home
      const hasAccess = await prisma.homeDweller.findFirst({
        where: {
          homeId: room.homeId,
          userId: req.user!.id,
          status: "active",
        },
      });

      if (!hasAccess) {
        return res
          .status(403)
          .json({ error: "You don't have access to delete this room" });
      }

      // If we get here, access is verified, proceed with deletion
      // Get all device IDs in this room
      const deviceIds = room.devices.map((device) => device.id);

      // Delete in the correct order to respect foreign key constraints
      // 1. First delete device controls
      await prisma.deviceControl.deleteMany({
        where: { deviceId: { in: deviceIds } },
      });

      // 2. Delete device triggers
      await prisma.deviceTrigger.deleteMany({
        where: { deviceId: { in: deviceIds } },
      });

      // 3. Delete energy logs
      await prisma.energyConsumptionLog.deleteMany({
        where: { deviceId: { in: deviceIds } },
      });

      // 4. Delete energy breakdowns
      await prisma.energyDeviceBreakdown.deleteMany({
        where: { deviceId: { in: deviceIds } },
      });

      // 5. Now we can delete the devices
      await prisma.device.deleteMany({
        where: { roomId: roomId },
      });

      // 6. Finally delete the room
      const deletedRoom = await prisma.room.delete({
        where: { id: roomId },
      });

      return res.json(deletedRoom);
    };

    deleteRoom().catch((error) => {
      console.error("Error deleting room:", error);
      res
        .status(500)
        .json({ error: "Failed to delete room", details: error.message });
    });
  } catch (error) {
    console.error("Error deleting room:", error);
    res.status(500).json({
      error: "Failed to delete room",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// POST new room - Simplify validation
router.post("/", (req: Request, res: Response) => {
  try {
    const createRoom = async () => {
      const { name, iconType, homeId } = req.body;

      // Validate required fields
      if (!name || !iconType || !homeId) {
        return res.status(400).json({
          error: "Missing required fields",
          required: ["name", "iconType", "homeId"],
        });
      }

      // Check if user has access to this home
      const hasAccess = await prisma.homeDweller.findFirst({
        where: {
          homeId: parseInt(homeId),
          userId: req.user!.id,
          status: "active",
        },
      });

      if (!hasAccess) {
        return res
          .status(403)
          .json({ error: "You don't have access to this home" });
      }

      // If we get here, access is verified, create the room
      const newRoom = await prisma.room.create({
        data: {
          name,
          iconType,
          homeId: parseInt(homeId),
        },
      });

      return res.status(201).json(newRoom);
    };

    createRoom().catch((error) => {
      console.error("Error creating room:", error);
      res.status(500).json({
        error: "Failed to create room",
        details: error.message,
      });
    });
  } catch (error) {
    console.error("Error creating room:", error);
    res.status(500).json({
      error: "Failed to create room",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// PUT update room - Simplify validation
router.put("/:id", (req: Request<RoomParams>, res: Response) => {
  try {
    const updateRoom = async () => {
      const roomId = parseInt(req.params.id);
      const { name, iconType, homeId } = req.body;

      // Check if the room exists
      const existingRoom = await prisma.room.findUnique({
        where: { id: roomId },
      });

      if (!existingRoom) {
        return res.status(404).json({ error: "Room not found" });
      }

      // Check if user has access to the current home
      const hasCurrentAccess = await prisma.homeDweller.findFirst({
        where: {
          homeId: existingRoom.homeId,
          userId: req.user!.id,
          status: "active",
        },
      });

      if (!hasCurrentAccess) {
        return res
          .status(403)
          .json({ error: "You don't have access to this room" });
      }

      // If changing the homeId, check access to the new home too
      if (homeId && parseInt(homeId) !== existingRoom.homeId) {
        const hasNewAccess = await prisma.homeDweller.findFirst({
          where: {
            homeId: parseInt(homeId),
            userId: req.user!.id,
            status: "active",
          },
        });

        if (!hasNewAccess) {
          return res
            .status(403)
            .json({ error: "You don't have access to the destination home" });
        }
      }

      // If we get here, access is verified, proceed with update
      // Create an update object only with the fields that are provided
      const updateData: any = {};
      if (name !== undefined) updateData.name = name;
      if (iconType !== undefined) updateData.iconType = iconType;
      if (homeId !== undefined) updateData.homeId = parseInt(homeId);

      // Update the room with only the provided fields
      const updatedRoom = await prisma.room.update({
        where: { id: roomId },
        data: updateData,
      });

      return res.json(updatedRoom);
    };

    updateRoom().catch((error) => {
      console.error("Error updating room:", error);
      res.status(500).json({
        error: "Failed to update room",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    });
  } catch (error) {
    console.error("Error updating room:", error);
    res.status(500).json({
      error: "Failed to update room",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export default router;
