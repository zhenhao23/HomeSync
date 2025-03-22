import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Load environment variables first
dotenv.config();

// Import Firebase Admin after environment variables are loaded
import "../firebase/config/firebaseAdmin";

import userRoutes from "./routes/userRoutes";
import deviceRoutes from "./routes/deviceRoutes";
import roomRoutes from "./routes/roomRoutes";
import homeRoutes from "./routes/homeRoutes";
import authRoutes from "./routes/authRoutes";
import dwellerRoutes from "./routes/dwellerRoutes";
import homeDataRoutes from "./routes/homeDataRoutes";
import solarRoutes from "./routes/solarRoutes";
import energyLimitRoutes from "./routes/energyLimitRoutes";

const app = express();
const PORT = process.env.PORT || 5000;

// More comprehensive CORS configuration
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:5173",
      "https://home-sync-pi.vercel.app", // Add your Vercel frontend URL
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // Add this if you're using cookies/credentials
  })
);

app.use(express.json());

// Logging middleware for debugging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Debugging environment variables (remove in production)
console.log("Environment Variables:");
console.log("PORT:", PORT);
console.log("FIREBASE_PROJECT_ID:", process.env.FIREBASE_PROJECT_ID);
console.log("FIREBASE_CLIENT_EMAIL:", process.env.FIREBASE_CLIENT_EMAIL);
console.log("FIREBASE_PRIVATE_KEY exists:", !!process.env.FIREBASE_PRIVATE_KEY);

// Use routes
app.use("/api/users", userRoutes);
app.use("/api/devices", deviceRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/homes", homeRoutes);
app.use("/api/dwellers", dwellerRoutes);
app.use("/api/homedata", homeDataRoutes);
app.use("/api/solar", solarRoutes);
app.use("/api/energy-limit", energyLimitRoutes);
app.use("/auth", authRoutes);

// Error handling middleware
app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error("Unhandled Error:", err);
    res.status(500).json({
      error: "Internal Server Error",
      message: err.message,
    });
  }
);

// Graceful shutdown
process.on("SIGINT", () => {
  console.log("Server shutting down...");
  process.exit(0);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
