// src/middleware/authenticateUser.ts
import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import { verifyToken } from "../config/firebaseAdmin"; // Updated import path

const prisma = new PrismaClient();

export const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = authHeader.split("Bearer ")[1];

  try {
    const decodedToken = await verifyToken(token);

    if (!decodedToken) {
      return res.status(403).json({ error: "Invalid token" });
    }

    // Find user in database using Firebase UID or email
    const user = await prisma.user.findUnique({
      where: {
        // Choose one based on your User model
        email: decodedToken.email,
        // OR firebaseUid: decodedToken.uid
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Attach user to request
    (req as any).user = user;
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(403).json({ error: "Unauthorized" });
  }
};

// Optional: Role-based access control
export const requireRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;

    if (!user || !roles.includes(user.role)) {
      return res.status(403).json({ error: "Insufficient permissions" });
    }

    next();
  };
};
