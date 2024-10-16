import { Request, Response, NextFunction } from "express";

// Global error handler middleware
export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err.stack); // Log the error stack (optional)
  // Send a JSON response with the error message
  res.status(500).json({ error: err.message || "Internal Server Error" });
};
