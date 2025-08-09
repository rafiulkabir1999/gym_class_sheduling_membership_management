import { Request, Response, NextFunction } from "express";
import * as scheduleService from "./schedule.service";

export async function createSchedule(req: Request & { user?: any }, res: Response, next: NextFunction) {
  try {
    const { title, startAt, trainerId } = req.body;
    if (!title || !startAt || !trainerId) {
      return res.status(400).json({
        success: false,
        message: "Validation error occurred.",
        errorDetails: { field: "body", message: "title, startAt and trainerId are required." }
      });
    }
    const schedule = await scheduleService.createSchedule({
      title,
      startAtIso: startAt,
      trainerId,
      createdById: req.user.id,
    });
    res.status(201).json({ success: true, statusCode: 201, message: "Schedule created successfully", data: schedule });
  } catch (err) {
    next(err);
  }
}

export async function listSchedules(req: Request, res: Response, next: NextFunction) {
  try {
    const date = req.query.date as string;
    if (!date) {
      return res.status(400).json({
        success: false,
        message: "Validation error occurred.",
        errorDetails: { field: "date", message: "date query parameter is required (YYYY-MM-DD)." }
      });
    }
    const schedules = await scheduleService.getSchedulesByDate(date);
    res.json({ success: true, statusCode: 200, data: schedules });
  } catch (err) {
    next(err);
  }
}
