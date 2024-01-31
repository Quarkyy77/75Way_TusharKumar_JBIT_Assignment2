import { Router, Request, Response } from "express";

import {
  registerEmployee,
  loginEmployee,
  AppointmentList,
} from "../controllers/employeeControllers";
import { errorHandler } from "../middlewares/errorhandler";
import { EmpRole } from "../middlewares/EmpRole";
const router = Router();

router.post("/register", registerEmployee);
router.post("/login", loginEmployee);
router.get("/listappointment", EmpRole, AppointmentList);

router.use(errorHandler);

export default router;
