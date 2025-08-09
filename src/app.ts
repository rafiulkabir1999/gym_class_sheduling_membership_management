import express from "express";
import cors from "cors";
import morgan from "morgan";
import { errorHandler } from "./middlewares/error.middleware";
import authRoutes from "./modules/auth/auth.routes";
import userRoutes from "./modules/users/user.routes";
import scheduleRoutes from "./modules/schedules/schedule.routes";
import bookingRoutes from "./modules/bookings/booking.routes";

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/schedules", scheduleRoutes);
app.use("/api/bookings", bookingRoutes);


// Global error handler
app.use(errorHandler);

export default app;
