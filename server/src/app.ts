import express, { Express } from "express";
import { errorHandler } from "@/middleware/errorHandler";
import authRoutes from "@/routes/auth.route";
import cors from "cors";
import { declareHandler } from "./middleware/declareHandler";
import sessionRoutes from "./routes/session.route";
import leaderboard from "./routes/leaderboard";

const app: Express = express();

app.use(express.json());
app.use(declareHandler);
app.use(
	cors({
		origin: "*",
	})
);

app.use("/auth", authRoutes);
app.use("/sessions", sessionRoutes);
app.use("/leaderboard", leaderboard);

app.use(errorHandler);

export default app;
