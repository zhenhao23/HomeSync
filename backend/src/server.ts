import express from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes";
import deviceRoutes from "./routes/deviceRoutes";
import roomRoutes from "./routes/roomRoutes";
import homeRoutes from "./routes/homeRoutes";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Use routes
app.use("/api/users", userRoutes);
app.use("/api/devices", deviceRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/homes", homeRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
