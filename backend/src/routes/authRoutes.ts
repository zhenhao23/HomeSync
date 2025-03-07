import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { auth } from "firebase-admin";
import bcrypt from "bcrypt";

const router = express.Router();
const prisma = new PrismaClient();

// POST route for user registration
router.post("/register", (req: Request, res: Response) => {
  try {
    const registerUser = async () => {
      const {
        email,
        password,
        firstName,
        lastName,
        role = "user",
        firebaseUid,
      } = req.body;

      // If firebaseUid is provided, use it instead of creating a new Firebase user
      let uid = firebaseUid;

      if (!uid) {
        // Only create Firebase user if no firebaseUid was provided
        const userRecord = await auth().createUser({
          email,
          password,
        });
        uid = userRecord.uid;
      }

      // Create user in Prisma database
      const user = await prisma.user.create({
        data: {
          firebaseUid: uid,
          email,
          passwordHash: password
            ? await hashPassword(password)
            : "google-auth-user",
          firstName,
          lastName,
          role,
        },
      });

      return res.status(201).json({
        message: "User registered successfully",
        userId: user.id,
      });
    };

    // ...existing code...

    registerUser().catch((error) => {
      console.error("Registration error:", error);
      res.status(500).json({
        error: "Registration failed",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      error: "Registration failed",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// POST route for login verification
router.post("/login", (req: Request, res: Response) => {
  try {
    const loginVerification = async () => {
      const { idToken } = req.body;

      // Verify Firebase ID token
      const decodedToken = await auth().verifyIdToken(idToken);

      // Find user in Prisma database
      const user = await prisma.user.findUnique({
        where: {
          firebaseUid: decodedToken.uid,
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
        },
      });

      if (!user) {
        return res.status(404).json({ error: "User not found in database" });
      }

      return res.json({
        message: "Login successful",
        user: user,
      });
    };

    loginVerification().catch((error) => {
      console.error("Login verification error:", error);
      res.status(401).json({
        error: "Authentication failed",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    });
  } catch (error) {
    console.error("Login verification error:", error);
    res.status(401).json({
      error: "Authentication failed",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Helper function for password hashing
async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

export default router;
