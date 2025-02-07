// roomRoutes.ts
import express from "express";
import prisma from "../prisma";

const router = express.Router();

// GET all rooms
router.get("/", async (req, res) => {
  try {
    const rooms = await prisma.room.findMany({
      include: {
        devices: {
          include: {
            controls: true,
          },
        },
      },
    });
    res.json(rooms);
  } catch (error) {
    console.error("Error fetching rooms:", error);
    res.status(500).json({ error: "Failed to fetch rooms" });
  }
});

// // GET room by ID
// router.get("/:id", async (req, res) => {
//   try {
//     const room = await prisma.room.findUnique({
//       where: { id: parseInt(req.params.id) },
//       include: {
//         devices: {
//           include: {
//             controls: true,
//             energyLogs: {
//               orderBy: {
//                 timestamp: "desc",
//               },
//               take: 1,
//             },
//           },
//         },
//       },
//     });
//     if (!room) {
//       return res.status(404).json({ error: "Room not found" });
//     }
//     res.json(room);
//   } catch (error) {
//     console.error("Error fetching room:", error);
//     res.status(500).json({ error: "Failed to fetch room" });
//   }
// });

export default router;
