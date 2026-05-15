import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import authRoutes from "./route/auth.routes";
import userRoutes from "./route/user.routes";
import userLogRoutes from "./route/user-log.routes";
import roleRoutes from "./route/role.routes";
import systemSettingsRoutes from "./route/system-settings.routes";
import gamificationTagRoutes from "./route/gamification-tag.routes";
import mediaDatabaseRoutes from "./route/media-database.routes";
import { UPLOAD_DIR } from "./middlewares/upload.middleware";
import { errorHandler } from "./middlewares/error.middleware";
import { swaggerSpec } from "./config/swagger";
import { initAssociations } from "./config/associations";

dotenv.config();

const app = express();

// ─── Security & Utils ──────────────────────────────────────────────
app.use(helmet());
app.use(cors());
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

initAssociations();

// ─── Health Check ──────────────────────────────────────────────────
app.get("/api/health", (_req, res) => {
  res.json({ success: true, message: "Server is running" });
});

// ─── Static Uploads ────────────────────────────────────────────────
app.use("/uploads", express.static(UPLOAD_DIR));

// ─── Swagger Docs ──────────────────────────────────────────────────
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ─── Routes ────────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/user-log", userLogRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/system-settings", systemSettingsRoutes);
app.use("/api/tags-gamification", gamificationTagRoutes);
app.use("/api/media-database", mediaDatabaseRoutes);

// ─── 404 ───────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// ─── Global Error Handler ──────────────────────────────────────────
app.use(errorHandler);

export default app;
