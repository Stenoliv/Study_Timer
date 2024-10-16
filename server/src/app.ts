import express, { Express } from "express";
import { errorHandler } from "@middleware/errorHandler";
import authRoutes from "@routes/auth";

const app: Express = express();

app.use(express.json());

app.use("/auth", authRoutes);

app.use(errorHandler);

export default app;
