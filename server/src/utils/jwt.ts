import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { nanoid } from "nanoid";
import { JwtType, jwtPayload } from "@/@types/jwt";
import { Token } from "@/db/models/token.model";
import moment from "moment";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

export const generateToken = async (
  userId: string,
  type: JwtType
): Promise<string> => {
  const jti = nanoid();
  const payload: jwtPayload = {
    jti: jti,
    sub: userId,
    type: type,
  };

  const expTime = {
    [JwtType.Access]: "1m",
    [JwtType.Refresh]: "24h",
  }[type];

  // Save token to db if refresh
  if (type == JwtType.Refresh) {
    const expiresAt = moment().add(24, "hours").toDate();
    await Token.create({
      jti,
      userId,
      expiresAt,
    });
  }

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
