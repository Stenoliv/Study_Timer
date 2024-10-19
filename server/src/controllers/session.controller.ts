import { Session } from "@/db/models/session.model";
import { createSession } from "@/services/session.service";
import { Request, Response } from "express";
import { Op } from "sequelize";

export const getSessionStatsController = async (
  req: Request,
  res: Response
) => {
  if (!req.user) {
    res.status(401).json({
      error: "Not authenticated: Couldn't get authentication state",
    });
    return;
  }

  const userId = req.user.sub;

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
    where: { userId: req.user.sub },
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
    throw new Error("Failed to create session");
  }

  try {
    const session = await createSession(userId, name, time);
    res.status(200).json({
      session,
    });
  } catch (error) {
    res.status(400).json({
      error: "Failed to create session",
    });
  }
};

export const getSessionController = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({
      error: "Not authenticated: Couldn't get authentication state",
    });
  }

  const userId = req.user.sub;
  const { time, name } = req.query; // Get time and name from query parameters

  try {
    const session = await Session.findOne({
      where: {
        userId,
        time: time ? parseInt(time as string, 10) : undefined, // Convert string to integer
        name: name ? (name as string) : undefined,
      },
    });

    if (!session) {
      return res.status(404).json({
        error: "Session not found for this user with the given parameters",
      });
    }

    return res.status(200).json({ session });
  } catch (error) {
    console.error("Error fetching session:", error);
    return res.status(500).json({
      error: "Internal server error while fetching session",
    });
  }
};
