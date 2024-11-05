import { Router } from "express";
import { getLeaderboard } from "@/controllers/leaderboard.controller";

const leaderboard = Router();

leaderboard.get("/", getLeaderboard);

export default leaderboard;
