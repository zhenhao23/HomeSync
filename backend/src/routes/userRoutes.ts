import express, {
  Request as ExpressRequest,
  Response as ExpressResponse,
} from "express";
import prisma from "../prisma";
import { verifyToken } from "../../firebase/middleware/authMiddleware";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import bcrypt from "bcrypt";
import { auth } from "firebase-admin";

// Update the AuthRequest interface to match what verifyToken adds
interface AuthRequest
  extends ExpressRequest<
    ParamsDictionary,
    any,
    any,
    ParsedQs,
    Record<string, any>
  > {
  user?: {
    id: number;
    firebaseUid: string | null;
    email: string;
    role: string;
    // Add other properties that the verifyToken middleware adds
  };
}

const router = express.Router();

// GET all users
router.get("/", async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// DELETE user by ID
router.delete("/:id", (req: ExpressRequest, res: ExpressResponse) => {
  try {
    const deleteUser = async () => {
      const userId = parseInt(req.params.id);

      if (isNaN(userId)) {
        return res.status(400).json({ error: "Invalid user ID format" });
      }

      // Check if user exists
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Delete the user
      await prisma.user.delete({
        where: { id: userId },
      });

      return res.status(200).json({ message: "User deleted successfully" });
    };

    deleteUser().catch((error) => {
      console.error("Error deleting user:", error);
      res.status(500).json({
        error: "Failed to delete user",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({
      error: "Failed to delete user",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// GET current user data (auth required)
router.get(
  "/current",
  verifyToken,
  (req: AuthRequest, res: ExpressResponse) => {
    try {
      const getCurrentUser = async () => {
        // Authentication check - this is handled by verifyToken middleware
        if (!req.user) {
          return res.status(401).json({ error: "Authentication required" });
        }

        const userId = req.user.id;

        // Fetch the user's complete profile data
        const user = await prisma.user.findUnique({
          where: { id: userId },
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            profilePictureUrl: true,
            role: true,
          },
        });

        if (!user) {
          return res.status(404).json({ error: "User not found" });
        }

        return res.json(user);
      };

      getCurrentUser().catch((error) => {
        console.error("Error fetching current user:", error);
        res.status(500).json({
          error: "Failed to fetch user data",
          details: error instanceof Error ? error.message : "Unknown error",
        });
      });
    } catch (error) {
      console.error("Error fetching current user:", error);
      res.status(500).json({
        error: "Failed to fetch user data",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
);

// Add this after your GET current user route

// PUT update current user (auth required)
// PUT update current user (auth required)
router.put(
  "/current",
  verifyToken,
  (req: AuthRequest, res: ExpressResponse) => {
    try {
      const updateCurrentUser = async () => {
        // Authentication check - this is handled by verifyToken middleware
        if (!req.user) {
          return res.status(401).json({ error: "Authentication required" });
        }

        const userId = req.user.id;
        const { firstName, lastName, profilePictureUrl } = req.body;

        // Replace this entire validation block
        // Validate input - let's fix this part
        if (
          (firstName === undefined || firstName === "") &&
          (lastName === undefined || lastName === "") &&
          profilePictureUrl === undefined
        ) {
          return res.status(400).json({
            error:
              "At least one valid field (firstName, lastName, profilePictureUrl) is required",
          });
        }

        // Individual field validation - more specific errors
        if (firstName !== undefined && firstName.trim() === "") {
          return res.status(400).json({ error: "First name cannot be empty" });
        }

        if (lastName !== undefined && lastName.trim() === "") {
          return res.status(400).json({ error: "Last name cannot be empty" });
        }

        // Create update data object with only fields that were provided
        const updateData: any = {};
        if (firstName !== undefined) updateData.firstName = firstName;
        if (lastName !== undefined) updateData.lastName = lastName;
        if (profilePictureUrl !== undefined)
          updateData.profilePictureUrl = profilePictureUrl;

        // Update the user's profile data
        const updatedUser = await prisma.user.update({
          where: { id: userId },
          data: updateData,
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            profilePictureUrl: true,
            role: true,
          },
        });

        return res.json({
          message: "User updated successfully",
          user: updatedUser,
        });
      };

      updateCurrentUser().catch((error) => {
        console.error("Error updating current user:", error);
        res.status(500).json({
          error: "Failed to update user data",
          details: error instanceof Error ? error.message : "Unknown error",
        });
      });
    } catch (error) {
      console.error("Error updating current user:", error);
      res.status(500).json({
        error: "Failed to update user data",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
);

// PUT change password (auth required)
router.put(
  "/change-password",
  verifyToken,
  (req: AuthRequest, res: ExpressResponse) => {
    try {
      const changePassword = async () => {
        // Authentication check - handled by verifyToken middleware
        if (!req.user) {
          return res.status(401).json({ error: "Authentication required" });
        }

        const userId = req.user.id;
        const { newPassword } = req.body;

        // Validate password
        if (
          !newPassword ||
          typeof newPassword !== "string" ||
          newPassword.trim() === ""
        ) {
          return res
            .status(400)
            .json({ error: "Valid new password is required" });
        }

        // Get user from database to get the Firebase UID
        const user = await prisma.user.findUnique({
          where: { id: userId },
          select: { firebaseUid: true },
        });

        if (!user || !user.firebaseUid) {
          return res
            .status(404)
            .json({ error: "User not found or missing Firebase UID" });
        }

        // Update password in Firebase Auth
        await auth().updateUser(user.firebaseUid, {
          password: newPassword,
        });

        // Hash the password for database storage
        const passwordHash = await bcrypt.hash(newPassword, 10);

        // Update password hash in the database
        await prisma.user.update({
          where: { id: userId },
          data: { passwordHash },
        });

        return res.json({
          message: "Password changed successfully",
        });
      };

      changePassword().catch((error) => {
        console.error("Error changing password:", error);
        res.status(500).json({
          error: "Failed to change password",
          details: error instanceof Error ? error.message : "Unknown error",
        });
      });
    } catch (error) {
      console.error("Error changing password:", error);
      res.status(500).json({
        error: "Failed to change password",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
);

// Add this route to get the user's permission level for a specific home
router.get(
  "/dwellers/permission/:homeId",
  verifyToken,
  (req: AuthRequest, res: ExpressResponse) => {
    try {
      const getPermissionLevel = async () => {
        if (!req.user) {
          return res.status(401).json({ error: "Authentication required" });
        }

        const userId = req.user.id;
        const homeId = parseInt(req.params.homeId);

        if (isNaN(homeId)) {
          return res.status(400).json({ error: "Invalid home ID" });
        }

        const homeDweller = await prisma.homeDweller.findFirst({
          where: {
            userId: userId,
            homeId: homeId,
          },
          select: {
            permissionLevel: true,
          },
        });

        if (!homeDweller) {
          return res
            .status(404)
            .json({ error: "User is not a member of this home" });
        }

        return res.json({ permissionLevel: homeDweller.permissionLevel });
      };

      getPermissionLevel().catch((error) => {
        console.error("Error getting permission level:", error);
        res.status(500).json({ error: "Failed to get permission level" });
      });
    } catch (error) {
      console.error("Error getting permission level:", error);
      res.status(500).json({ error: "Failed to get permission level" });
    }
  }
);

export default router;
