import { loginUser, registerUser } from "@services/auth";
import { NextFunction, Request, Response } from "express";

export const userLoginController = async (
  req: Request,
  res: Response,
  _next: NextFunction
): Promise<void> => {
  const { email, password } = req.body;

  try {
    const token = await loginUser(email, password);

    res.status(200).json({ token: token });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const userRegisterController = async (
  req: Request,
  res: Response,
  _next: NextFunction
): Promise<void> => {
  const { username, email, password } = req.body;

  try {
    const token = await registerUser(username, email, password);

    res.status(201).json({ token });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
