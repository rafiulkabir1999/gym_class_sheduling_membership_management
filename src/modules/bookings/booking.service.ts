import prisma from "../../prismaClient";
import { areIntervalsOverlapping } from "date-fns";

export async function createBooking({ traineeId, scheduleId }) {
  // load schedule
  const schedule = await prisma.schedule.findUnique({
    where: { id: scheduleId },
    include: { bookings: true }
  });
  if (!schedule) throw { status: 404, message: "Schedule not found." };

  // capacity check
  if (schedule.bookings.length >= schedule.capacity) {
    throw { status: 400, message: "Class schedule is full. Maximum 10 trainees allowed per schedule." };
  }

  // check overlap
  const traineeBookings = await prisma.booking.findMany({
    where: { traineeId },
    include: { schedule: true }
  });

  for (const b of traineeBookings) {
    if (areIntervalsOverlapping(
      { start: schedule.startAt, end: schedule.endAt },
      { start: b.schedule.startAt, end: b.schedule.endAt }
    )) {
      throw { status: 400, message: "You already have a booking in this time slot." };
    }
  }

  // create booking
  const booking = await prisma.booking.create({
    data: { traineeId, scheduleId }
  });
  return booking;
}

export async function cancelBooking(bookingId: number, traineeId: number) {
  const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
  if (!booking) throw { status: 404, message: "Booking not found." };
  if (booking.traineeId !== traineeId) throw { status: 403, message: "Unauthorized to cancel this booking." };

  await prisma.booking.delete({ where: { id: bookingId } });
  return;
}

export async function getBookingsForUser(userId: number, role: string) {
  if (role === "ADMIN") {
    return prisma.booking.findMany({ include: { trainee: true, schedule: true } });
  } else if (role === "TRAINER") {
    // find schedules assigned to trainer
    const schedules = await prisma.schedule.findMany({ where: { trainerId: userId } });
    const scheduleIds = schedules.map(s => s.id);
    return prisma.booking.findMany({
      where: { scheduleId: { in: scheduleIds } },
      include: { trainee: true, schedule: true }
    });
  } else {
    // trainee only their own bookings
    return prisma.booking.findMany({
      where: { traineeId: userId },
      include: { schedule: true }
    });
  }
}
