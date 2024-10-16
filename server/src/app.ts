import express, { Express } from "express";
import { errorHandler } from "@middleware/errorHandler";
import authRoutes from "@routes/auth";
import cors from "cors";

const app: Express = express();

app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

app.use("/auth", authRoutes);

app.use(errorHandler);

export default app;
