import { jwtPayload } from "./jwt";

declare module "express-serve-static-code" {
  interface Request {
    user?: jwtPayload;
  }
}
