import { jwtPayload } from "@/@types/jwt";
import { Request, Response, NextFunction } from "express";

declare global {
  namespace Express {
    interface Request {
      user: undefined | jwtPayload;
    }
  }
}

export function declareHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  req.user = undefined;

  next();
}
