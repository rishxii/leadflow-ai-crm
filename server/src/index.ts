import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import leadRoutes from "./routes/leadRoutes";
import noteRoutes from "./routes/noteRoutes";
import authRoutes from "./routes/authRoutes";
import dashboardRoutes from "./routes/dashboardRoutes";
import taskRoutes from "./routes/taskRoutes";
import aiRoutes from "./routes/aiRoutes";

dotenv.config();

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);

app.use(cookieParser());

app.get("/health", (req, res) => {
  res.json({ message: "CRM Backend Running" });
});

app.use("/api/leads", leadRoutes);

app.use("/api/notes", noteRoutes);

const PORT = process.env.PORT || 5000;

app.use("/api/ai", aiRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.use("/api/auth", authRoutes);

app.use("/api/dashboard", dashboardRoutes);

app.use("/api/tasks", taskRoutes);
