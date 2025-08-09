import { Router } from "express";
import * as bookingController from "./booking.controller";
import { jwtMiddleware } from "../auth/jwt.middleware";

const router = Router();

router.post("/", jwtMiddleware, bookingController.createBooking);      // trainee books
router.delete("/:id", jwtMiddleware, bookingController.cancelBooking); // trainee cancels
router.get("/", jwtMiddleware, bookingController.listBookings);        // role based listing

export default router;
