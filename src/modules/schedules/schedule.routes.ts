import { Router } from "express";
import * as scheduleController from "./schedule.controller";
import { jwtMiddleware } from "../auth/jwt.middleware";
import { requireRole } from "../../middlewares/role.middleware";

const router = Router();

router.post("/", jwtMiddleware, requireRole(["ADMIN"]), scheduleController.createSchedule);
router.get("/", jwtMiddleware, scheduleController.listSchedules);

export default router;
