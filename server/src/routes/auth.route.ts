import { Router } from "express";
import { userLoginController } from "@controllers/auth";

const auth = Router();

auth.post("/signin", userLoginController);

export default auth;
