import { Router } from "express";
import {
  userLoginController,
  userRefreshController,
  userRegisterController,
} from "@/controllers/auth.controller";
import AuthMiddleware from "@/middleware/authMiddleware";

const auth = Router();

auth.post("/signin", userLoginController);
auth.post("/signup", userRegisterController);
auth.get("/refresh", AuthMiddleware, userRefreshController);

export default auth;
