import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { nanoid } from "nanoid";
import { JwtType, jwtPayload } from "@/types/jwt";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

export const generateToken = (userId: string, type: JwtType): string => {
  const payload: jwtPayload = {
    jti: nanoid(),
    sub: userId,
    type: type,
  };

  const expTime = {
    [JwtType.Access]: "1m",
    [JwtType.Refresh]: "24h",
  }[type];

  return jwt.sign({ ...payload }, JWT_SECRET, {
    expiresIn: expTime,
  });
};

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
};
