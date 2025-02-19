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

export default router;
