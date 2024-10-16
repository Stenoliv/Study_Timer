import { Session } from "@/db/models/session.model";
import { Request, Response } from "express";
import { Op } from "sequelize";

export const getStats = async (req: Request, res: Response) => {
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
