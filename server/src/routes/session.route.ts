import {
  createSessionController,
  getSessionStatsController,
} from "@/controllers/session.controller";
import AuthMiddleware from "@/middleware/authMiddleware";
import { Router } from "express";

const sessionRoutes = Router();
sessionRoutes.use(AuthMiddleware);

sessionRoutes.post("", createSessionController);
sessionRoutes.get("/stats", getSessionStatsController);

export default sessionRoutes;
