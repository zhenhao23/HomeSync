import express from "express";
import prisma from "../prisma";

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
router.delete("/:id", (req: express.Request, res: express.Response) => {
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

export default router;
