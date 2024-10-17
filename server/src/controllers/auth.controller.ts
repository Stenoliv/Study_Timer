import { loginUser, registerUser } from "@/services/auth.service";
import { Request, Response } from "express";

export const userLoginController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { email, password } = req.body;

  try {
    const { user, tokens } = await loginUser(email, password);

    res.status(200).json({ user, tokens });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const userRegisterController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { username, email, password } = req.body;

  try {
    const { user, tokens } = await registerUser(username, email, password);

    res.status(201).json({ user, tokens });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const userRefreshController = async (
  req: Request,
  res: Response
): Promise<void> => {};
