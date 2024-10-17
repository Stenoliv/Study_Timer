import { getStats } from "@/controllers/session.controller";
import AuthMiddleware from "@/middleware/authMiddleware";
import { Router } from "express";

const sessionRoutes = Router();
sessionRoutes.use(AuthMiddleware);

sessionRoutes.get("/stats", getStats);

export default sessionRoutes;
