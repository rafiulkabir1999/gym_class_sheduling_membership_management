import prisma from "../../prismaClient";
import { addHours, startOfDay, endOfDay } from "date-fns";

export async function createSchedule({ title, startAtIso, trainerId, createdById }) {
  const startAt = new Date(startAtIso);
  const endAt = addHours(startAt, 2);

  // validate trainer
  const trainer = await prisma.user.findUnique({ where: { id: trainerId }});
  if (!trainer || trainer.role !== "TRAINER") {
    throw { status: 400, message: "Invalid trainer." };
  }

  // check max 5 schedules per day
  const dayStart = startOfDay(startAt);
  const dayEnd = endOfDay(startAt);

  const count = await prisma.schedule.count({
    where: { startAt: { gte: dayStart, lte: dayEnd } }
  });
  if (count >= 5) {
    throw { status: 400, message: "Schedule limit exceeded. Max 5 schedules per day." };
  }

  const schedule = await prisma.schedule.create({
    data: { title, startAt, endAt, trainerId, createdById }
  });
  return schedule;
}

export async function getSchedulesByDate(dateISO: string) {
  const date = new Date(dateISO);
  const dayStart = startOfDay(date);
  const dayEnd = endOfDay(date);
  const schedules = await prisma.schedule.findMany({
    where: {
      startAt: {
        gte: dayStart,
        lte: dayEnd,
      }
    },
    include: {
      trainer: { select: { id: true, name: true, email: true } }
    }
  });
  return schedules;
}
