import { Session } from "@/db/models/session.model";
import { createSession } from "@/services/session.service";
import { Request, Response } from "express";
import { Op } from "sequelize";

export const getSessionStatsController = async (
	req: Request,
	res: Response
) => {
	const userId = req.user?.sub;

	if (!userId) {
		res.status(401).json({
			error: "Not authenticated: Failed to get a authenticated user!",
		});
		return;
	}

	// Get current date and start of the day
	const today = new Date();
	const startOfDay = new Date(
		today.getFullYear(),
		today.getMonth(),
		today.getDate()
	);

	// Get todays hours
	const todaysSessions = await Session.findAll({
		where: {
			userId: userId,
			createdAt: {
				[Op.gte]: startOfDay,
			},
		},
	});
	const todaysMinutes = todaysSessions.reduce(
		(acc, session) => acc + session.time,
		0
	);

	// Get total hours
	const totalSessions = await Session.findAll({
		where: { userId: userId },
	});
	const totalHours = totalSessions.reduce(
		(acc, session) => acc + session.time,
		0
	);

	// Pagination
	const page = parseInt(req.query.page as string) || 1;
	const limit = parseInt(req.query.limit as string) || 10;
	const offset = (page - 1) * limit;

	const sessions = await Session.findAll({
		where: { userId: userId },
		limit: limit,
		offset: offset,
		order: [["createdAt", "DESC"]],
	});

	res.status(200).json({
		todaysMinutes,
		totalHours,
		sessions,
		currentPage: page,
		totalPages: Math.ceil(totalSessions.length / limit) || 1,
	});
};

export const createSessionController = async (req: Request, res: Response) => {
	const { name, time } = req.body;
	const userId = req.user?.sub;

	if (!userId) {
		res.status(401).json({
			error: "Not authenticated: Failed to get a authenticated user!",
		});
		return;
	}

	if (typeof name !== "string" || typeof time !== "number") {
		res.status(400).json({
			error: "Invalid input types",
		});
		return;
	}

	try {
		const session = await createSession(userId, name, time);
		res.status(200).json({
			session,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			error: "Server error occured while trying to create session!",
		});
		return;
	}
};

export const getSessionController = async (req: Request, res: Response) => {
	const userId = req.user?.sub;

	if (!userId) {
		res.status(401).json({
			error: "Not authenticated: Failed to get a authenticated user!",
		});
		return;
	}

	const { id } = req.params;

	try {
		const session = await Session.findOne({
			where: {
				userId,
				id,
			},
		});

		if (!session) {
			res.status(400).json({
				error: "Failed to get session!",
			});
			return;
		}
		res.status(200).json({ session });
		return;
	} catch (error) {
		console.log(error);
		res.status(400).json({
			error: "Server error occured while trying to get session!",
		});
		return;
	}
};

export const getLatestSessionController = async (
	req: Request,
	res: Response
) => {
	const userId = req.user?.sub;

	if (!userId) {
		res.status(401).json({
			error: "Not authenticated: Failed to get a authenticated user!",
		});
		return;
	}

	try {
		const session = await Session.findOne({
			where: {
				userId,
			},
			order: [["createdAt", "DESC"]],
		});

    if (!session) {
      res.status(404).json({
        error: "Session not found for this user with the given parameters",
      });
      return;
    }
    res.status(200).json({ session });
    return;
  } catch (error) {
    console.error("Error fetching session:", error);
    res.status(500).json({
      error: "Internal server error while fetching session",
    });
    return;
  }
};

export const updateSessionController = async (req: Request, res: Response) => {
  if (!req.user) {
    res.status(401).json({
      error: "Not authenticated: Couldn't get authentication state",
    });
    return;
  }
  const userId = req.user.sub;
  const { id } = req.params;
  const updatedTime = req.body.time;
  try {
    const updatedSession = await Session.update(
      { time: updatedTime },
      {
        where: {
          userId,
          id,
        },
        returning: true,
      }
    );
    if (!updatedSession[1]) {
      res.status(404).json({ error: "Session not found" });
      return;
    }
    res.status(200).json({
      message: "Session updated successfully",
      session: updatedSession[1][0], // The updated session data (based on your ORM's return)
    });
    return;
  } catch (error) {
    console.error("Error updating session:", error);
    res.status(500).json({
      error: "Internal server error while updating session",
    });
    return;
  }
};

export const deleteSessionController = async (req: Request, res: Response) => {
	if (!req.user) {
		res.status(401).json({
			error: "Not authenticated: Couldn't get authentication state",
		});
		return;
	}
	const userId = req.user.sub;
	const { id } = req.params;
	try {
		const deleted = await Session.destroy({
			where: {
				userId,
				id,
			},
		});
		if (!deleted) {
			res.status(404).json({ error: "Session not found" });
			return;
		}
		res.status(200).json({
			message: "Session deleted successfully",
			session: id, // The updated session data (based on your ORM's return)
		});
	} catch (error) {
		console.error("Error deleting session:", error);
		res.status(500).json({
			error: "Internal server error while deleting session",
		});
		return;
	}
};
