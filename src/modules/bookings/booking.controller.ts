import { Request, Response, NextFunction } from "express";
import * as bookingService from "./booking.service";

export async function createBooking(req: Request & { user?: any }, res: Response, next: NextFunction) {
  try {
    const { scheduleId } = req.body;
    if (!scheduleId) return res.status(400).json({ success: false, message: "Validation error occurred.", errorDetails: { field: "scheduleId", message: "scheduleId is required." } });

    // only trainees can book
    if (req.user.role !== "TRAINEE") {
      return res.status(403).json({ success: false, message: "Unauthorized access.", errorDetails: "You must be a trainee to book classes." });
    }

    const booking = await bookingService.createBooking({ traineeId: req.user.id, scheduleId });
    res.status(201).json({ success: true, statusCode: 201, message: "Class booked successfully", data: booking });
  } catch (err) {
    next(err);
  }
}

export async function cancelBooking(req: Request & { user?: any }, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ success: false, message: "Validation error occurred.", errorDetails: { field: "id", message: "Invalid id" }});

    await bookingService.cancelBooking(id, req.user.id);
    res.json({ success: true, statusCode: 200, message: "Booking cancelled" });
  } catch (err) {
    next(err);
  }
}

export async function listBookings(req: Request & { user?: any }, res: Response, next: NextFunction) {
  try {
    const bookings = await bookingService.getBookingsForUser(req.user.id, req.user.role);
    res.json({ success: true, statusCode: 200, data: bookings });
  } catch (err) {
    next(err);
  }
}
