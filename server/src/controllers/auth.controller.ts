import { JwtType } from "@/@types/jwt";
import { Token } from "@/db/models/token.model";
import { User } from "@/db/models/user.model";
import { loginUser, registerUser } from "@/services/auth.service";
import { generateToken } from "@/utils/jwt";
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
): Promise<void> => {
  const type = req.user?.type;

  if (type !== JwtType.Refresh) {
    res.status(400).json({
      error: "Failed to refresh: Wrong token type!",
    });
    return;
  }

  const user = await User.findByPk(req.user?.sub);
  if (!user) {
    res.status(400).json({
      error: "Failed to refresh: User not found!",
    });
    return;
  }

  const token = await Token.findOne({
    where: { jti: req.user?.jti, userId: user.id },
  });

  if (!token) {
    res.status(400).json({
      error: "Failed to refresh: Token expired or logged out!",
    });
    return;
  }

  const access = await generateToken(user.id, JwtType.Access);

  res.status(200).json({ access: access });
};

export const userSignOutController = async (req: Request, res: Response) => {};
