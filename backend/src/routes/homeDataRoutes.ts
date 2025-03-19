import { Router, Request, Response } from "express";
import prisma from "../prisma";
import { verifyToken } from "../../firebase/middleware/authMiddleware";

const router = Router();

// Apply authentication to all routes
router.use(verifyToken);

// GET all rooms and devices for a home in the frontend format
router.get("/:homeId", (req: Request, res: Response) => {
  try {
    const getHomeData = async () => {
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
          // Include both active and pending statuses for now
          status: { in: ["active", "pending"] },
        },
      });

      if (!hasAccess) {
        return res
          .status(403)
          .json({ error: "You don't have access to this home" });
      }

      // Fetch all rooms for this home
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

      // Fetch all collaborators for this home
      const collaborators = await prisma.homeDweller.findMany({
        where: {
          homeId: homeId,
          status: "active", // Keep this as "active" only
        },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              profilePictureUrl: true,
            },
          },
        },
      });

      // Guard against empty data
      if (!rooms || !rooms.length) {
        // Return empty arrays instead of null/undefined to prevent .map() errors
        return res.json({
          roomsState: [],
          devicesState: [],
        });
      }

      // Transform data to match frontend format
      const roomsState = rooms.map((room) => ({
        id: room.id,
        image: mapRoomIconToImage(room.iconType),
        title: room.name,
        devices: room.devices.length,
        collaborators: mapCollaborators(room.id, collaborators),
      }));

      const devicesState = rooms.flatMap((room) =>
        (room.devices || []).map((device) => ({
          device_id: device.id,
          room_id: room.id,
          image: mapDeviceIconToImage(device.iconType),
          title: device.displayName,
          deviceType: device.type.toLowerCase(),
          status: device.status,
          swiped: device.swiped,
          devData: {
            id: device.id,
            iconImage: mapDeviceIconToManageIcon(device.iconType),
            ...mapDeviceControlsToDevData(device.controls || []),
          },
          content: mapDeviceTriggersToContent(device.triggers || []),
        }))
      );

      return res.json({
        roomsState,
        devicesState,
      });
    };

    // Execute the async function with proper error handling
    getHomeData().catch((error) => {
      console.error("Error fetching home data:", error);
      res.status(500).json({
        error: "Failed to fetch home data",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    });
  } catch (error) {
    console.error("Error in home data route:", error);
    res.status(500).json({
      error: "Server error while processing home data request",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Modify your mapping functions
function mapRoomIconToImage(iconType: string): string {
  // Just return the iconType
  return iconType;
}

function mapDeviceIconToImage(iconType: string): string {
  // Just return the iconType
  return iconType;
}

function mapDeviceIconToManageIcon(iconType: string): string {
  // Just return the iconType
  return iconType;
}

function mapDeviceControlsToDevData(controls: any[]): any {
  const data = {
    percentage: 0,
    celsius: 0,
    waterFlow: 0,
  };

  controls.forEach((control) => {
    switch (control.controlType) {
      case "percentage":
        data.percentage = Number(control.currentValue);
        break;
      case "temperature":
        data.celsius = Number(control.currentValue);
        break;
      case "waterFlow":
        data.waterFlow = Number(control.currentValue);
        break;
    }
  });

  return data;
}

function mapDeviceTriggersToContent(triggers: any[]): any[] {
  return triggers.map((trigger) => ({
    feature_id: trigger.id,
    feature: trigger.featurePeriod || "Default", // Use featurePeriod as the feature name
    label: trigger.featureDetail || trigger.conditionOperator, // Use featureDetail as the label
    status: trigger.isActive,
    isUserAdded: trigger.featurePeriod !== "Default",
  }));
}

function mapCollaborators(roomId: number, collaborators: any[]): any[] {
  return collaborators.map((collab) => ({
    id: collab.user.id,
    name: `${collab.user.firstName} ${collab.user.lastName}`,
    image:
      collab.user.profilePictureUrl || "../assets/addCollab/collab-profile.svg",
    type: collab.permissionLevel === "OWNER" ? "Owner" : "Dweller",
  }));
}

export default router;
