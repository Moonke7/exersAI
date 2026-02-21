import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import exercisesRouter from "./routes/exercises/routes.js";
import authRouter from "./routes/auth/routes.js";
import espaciosRouter from "./routes/espacios/routes.js";
import equipamientoRouter from "./routes/equipamiento/routes.js";
import rutinasRouter from "./routes/rutinas/routes.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRouter);
app.use("/api/exercises", exercisesRouter);
app.use("/api/espacios", espaciosRouter);
app.use("/api/equipamiento", equipamientoRouter);
app.use("/api/rutinas", rutinasRouter);

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "Server is running" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Error handler
app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    console.error(err.stack);
    res.status(500).json({ error: "Something went wrong!" });
  },
);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`Access server at http://192.168.100.23:${PORT}`);
});
