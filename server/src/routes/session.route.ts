import {
  createSessionController,
  getLatestSessionController,
  getSessionController,
  getSessionStatsController,
  updateSessionController,
} from "@/controllers/session.controller";
import AuthMiddleware from "@/middleware/authMiddleware";
import { getSession } from "@/services/session.service";
import { Router } from "express";

const sessionRoutes = Router();
sessionRoutes.use(AuthMiddleware);

sessionRoutes.post("", createSessionController);
sessionRoutes.get("/stats", getSessionStatsController);
sessionRoutes.get("/:id", getSessionController);
sessionRoutes.get("", getLatestSessionController);
sessionRoutes.patch("/:id", updateSessionController);

export default sessionRoutes;
