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
interface RoomParams {
  id: string;
  homeId?: string;
  [key: string]: string | undefined; // Add index signature to satisfy ParamsDictionary constraint
}

// Apply authentication to all room routes
router.use((req: Request, res: Response, next: NextFunction) => {
  verifyToken(req, res, next);
});

// Rest of your code remains the same...

// GET all rooms for a specific home
router.get("/home/:homeId", (req: Request, res: Response) => {
  try {
    const getAllRooms = async () => {
      const homeId = parseInt(req.params.homeId);

      // Create a middleware specific to this homeId
      const homeAccessMiddleware = checkHomeAccess(homeId);

      // Return a promise that resolves when the middleware completes
      const checkAccess = () =>
        new Promise<void>((resolve, reject) => {
          homeAccessMiddleware(req, res, () => resolve());
        });

      try {
        // Check access first
        await checkAccess();

        // If we get here, access is verified, get rooms data
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
      } catch (error) {
        // Error handling is done by the middleware
        return;
      }
    };

    getAllRooms().catch((error) => {
      console.error("Error fetching rooms:", error);
      res.status(500).json({ error: "Failed to fetch rooms" });
    });
  } catch (error) {
    console.error("Error fetching rooms:", error);
    res.status(500).json({ error: "Failed to fetch rooms" });
  }
});

// GET room by ID
router.get("/:id", (req: Request<RoomParams>, res: Response) => {
  try {
    const getRoomById = async () => {
      const roomId = parseInt(req.params.id);

      // First get the room to check its homeId
      const roomInfo = await prisma.room.findUnique({
        where: { id: roomId },
        select: { homeId: true },
      });

      if (!roomInfo) {
        return res.status(404).json({ error: "Room not found" });
      }

      // Create a middleware specific to this homeId
      const homeAccessMiddleware = checkHomeAccess(roomInfo.homeId);

      // Return a promise that resolves when the middleware completes
      const checkAccess = () =>
        new Promise<void>((resolve, reject) => {
          homeAccessMiddleware(req as any, res, () => resolve());
        });

      try {
        // Check access first
        await checkAccess();

        // If we get here, access is verified, get full room data
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
      } catch (error) {
        // Error handling is done by the middleware
        return;
      }
    };

    getRoomById().catch((error) => {
      console.error("Error fetching room:", error);
      res.status(500).json({ error: "Failed to fetch room" });
    });
  } catch (error) {
    console.error("Error fetching room:", error);
    res.status(500).json({ error: "Failed to fetch room" });
  }
});

// DELETE room by ID
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

      // Create a middleware specific to this homeId
      const homeAccessMiddleware = checkHomeAccess(room.homeId);

      // Return a promise that resolves when the middleware completes
      const checkAccess = () =>
        new Promise<void>((resolve, reject) => {
          homeAccessMiddleware(req as any, res, () => resolve());
        });

      try {
        // Check access first
        await checkAccess();

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
      } catch (error) {
        // Error handling is done by the middleware
        return;
      }
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

// POST new room
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

      // Create a middleware specific to this homeId
      const homeAccessMiddleware = checkHomeAccess(homeId);

      // Return a promise that resolves when the middleware completes
      const checkAccess = () =>
        new Promise<void>((resolve, reject) => {
          homeAccessMiddleware(req, res, () => resolve());
        });

      try {
        // Check access first
        await checkAccess();

        // If we get here, access is verified, create the room
        const newRoom = await prisma.room.create({
          data: {
            name,
            iconType,
            homeId: parseInt(homeId),
          },
        });

        return res.status(201).json(newRoom);
      } catch (error) {
        // Error handling is done by the middleware
        return;
      }
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

// PUT update room
router.put("/:id", (req: Request<RoomParams>, res: Response) => {
  try {
    const updateRoom = async () => {
      const roomId = parseInt(req.params.id);
      const { name, iconType, homeId } = req.body;

      // Check if the room exists and get its homeId
      const existingRoom = await prisma.room.findUnique({
        where: { id: roomId },
      });

      if (!existingRoom) {
        return res.status(404).json({ error: "Room not found" });
      }

      // Determine which homeId to check (if we're changing homes, check both)
      const homeIdToCheck = homeId || existingRoom.homeId;

      // Create a middleware specific to this homeId
      const homeAccessMiddleware = checkHomeAccess(homeIdToCheck);

      // Return a promise that resolves when the middleware completes
      const checkAccess = () =>
        new Promise<void>((resolve, reject) => {
          homeAccessMiddleware(req as any, res, () => resolve());
        });

      try {
        // Check access first
        await checkAccess();

        // If we're changing homeId and it's different, verify access to the new home too
        if (homeId && homeId !== existingRoom.homeId) {
          const newHomeAccessMiddleware = checkHomeAccess(homeId);

          const checkNewHomeAccess = () =>
            new Promise<void>((resolve, reject) => {
              newHomeAccessMiddleware(req as any, res, () => resolve());
            });

          await checkNewHomeAccess();
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
      } catch (error) {
        // Error handling is done by the middleware
        return;
      }
    };

    updateRoom().catch((error) => {
      console.error("Error updating room:", error);
      res.status(500).json({
        error: "Failed to update room",
        details: error.message,
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
