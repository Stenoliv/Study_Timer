import { Session } from "@/db/models/session.model";
import { User } from "@/db/models/user.model";
import { Request, Response } from "express";
import { Sequelize, Op, fn, col, literal } from "sequelize";

export const getLeaderboard = async (req: Request, res: Response) => {
	const page = parseInt(req.query.page as string) || 1;
	const pageSize = 10;
	const offset = (page - 1) * pageSize;

	try {
		const leaderboard = await Session.findAll({
			attributes: ["userId", [fn("SUM", col("time")), "totalTime"]],
			include: [
				{
					model: User,
					attributes: ["id", "username"],
				},
			],
			group: ["userId", "User.id"],
			limit: pageSize,
			offset: offset,
			order: [[literal("totalTime"), "DESC"]],
		});

		res.status(200).json({ leaderboard: leaderboard });
	} catch (error) {
		console.error(error);
		res
			.status(500)
			.json({ error: "An error occurred while fetching the leaderboard." });
	}
};
