import { Request, Response, NextFunction } from "express";
import { auth } from "firebase-admin";
import prisma from "../../src/prisma";

// Extend the Request type to include user information
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        firebaseUid: string | null;
        email: string;
        role: string;
      };
    }
  }
}

// Middleware to verify Firebase JWT token
export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // Changed return type to void
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ error: "Authorization token required" });
      return; // Make sure to return after sending response
    }

    const token = authHeader.split(" ")[1];

    try {
      // Verify the token with Firebase
      const decodedToken = await auth().verifyIdToken(token);

      // Find the user in our database
      const user = await prisma.user.findUnique({
        where: { firebaseUid: decodedToken.uid },
        select: {
          id: true,
          firebaseUid: true,
          email: true,
          role: true,
        },
      });

      if (!user) {
        res.status(404).json({ error: "User not found" });
        return; // Make sure to return after sending response
      }

      // Attach user to request object
      req.user = user;
      next();
    } catch (error) {
      console.error("Token verification error:", error);
      res.status(401).json({
        error: "Invalid or expired token",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(500).json({
      error: "Authentication failed",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Middleware to verify home access permission
export const verifyHomeAccess = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // Changed return type to void
  try {
    if (!req.user) {
      res.status(401).json({ error: "Authentication required" });
      return; // Make sure to return after sending response
    }

    const userId = req.user.id;

    // Get homeId from query params, route params, or request body
    const homeId = parseInt(
      req.params.homeId || req.query.homeId?.toString() || req.body.homeId
    );

    if (!homeId || isNaN(homeId)) {
      res.status(400).json({ error: "Valid homeId is required" });
      return; // Make sure to return after sending response
    }

    // Check if the user is the owner of the home
    const ownedHome = await prisma.smartHome.findFirst({
      where: {
        id: homeId,
        homeownerId: userId,
      },
    });

    if (ownedHome) {
      next();
      return; // Return after calling next
    }

    // Check if the user is a dweller with access to this home
    const homeDweller = await prisma.homeDweller.findFirst({
      where: {
        homeId: homeId,
        userId: userId,
        status: "active",
      },
    });

    if (!homeDweller) {
      res.status(403).json({ error: "You don't have access to this home" });
      return; // Make sure to return after sending response
    }

    next();
  } catch (error) {
    console.error("Home access verification error:", error);
    res.status(500).json({
      error: "Failed to verify home access",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Add a factory function that creates a middleware with homeId
export const checkHomeAccess = (homeId: number | string) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ error: "Authentication required" });
        return;
      }

      const userId = req.user.id;
      const parsedHomeId =
        typeof homeId === "string" ? parseInt(homeId) : homeId;

      if (!parsedHomeId || isNaN(parsedHomeId)) {
        res.status(400).json({ error: "Valid homeId is required" });
        return;
      }

      // Check if the user is the owner of the home
      const ownedHome = await prisma.smartHome.findFirst({
        where: {
          id: parsedHomeId,
          homeownerId: userId,
        },
      });

      if (ownedHome) {
        next();
        return;
      }

      // Check if the user is a dweller with access to this home
      const homeDweller = await prisma.homeDweller.findFirst({
        where: {
          homeId: parsedHomeId,
          userId: userId,
          status: "active",
        },
      });

      if (!homeDweller) {
        res.status(403).json({ error: "You don't have access to this home" });
        return;
      }

      next();
    } catch (error) {
      console.error("Home access verification error:", error);
      res.status(500).json({
        error: "Failed to verify home access",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };
};
