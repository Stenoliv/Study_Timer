import { jwtPayload } from "@/@types/jwt";
import { verifyToken } from "@/utils/jwt";
import { NextFunction, Request, Response } from "express";

function AuthMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    res.status(401).send({
      error: "Not authenticated: No token provides",
    });
    return;
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    res.status(401).send({
      error: "Not authenticated: Invalid or expired token",
    });
    return;
  }

  req.user = decoded as jwtPayload;

  next();
}

export default AuthMiddleware;
