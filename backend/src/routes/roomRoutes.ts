//roomRoutes.ts
import { Router, Request, Response } from "express";
import prisma from "../prisma";

const router = Router();

interface RoomParams {
  id: string;
}

// GET all rooms
router.get("/", (req: Request, res: Response) => {
  try {
    const getAllRooms = async () => {
      const rooms = await prisma.room.findMany({
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
      const room = await prisma.room.findUnique({
        where: { id: parseInt(req.params.id) },
        include: {
          devices: {
            include: {
              controls: true,
              energyLogs: {
                orderBy: {
                  timestamp: "desc",
                },
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

      // First check if the room exists
      const room = await prisma.room.findUnique({
        where: { id: roomId },
        include: { devices: true },
      });

      if (!room) {
        return res.status(404).json({ error: "Room not found" });
      }

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

      // Create the new room
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

// PUT update room
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
