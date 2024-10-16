import { Router } from "express";
import { userLoginController, userRegisterController } from "@controllers/auth";

const auth = Router();

auth.post("/signin", userLoginController);
auth.post("/signup", userRegisterController);

export default auth;