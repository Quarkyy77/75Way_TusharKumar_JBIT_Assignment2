import { Router, Request, Response } from "express";
import {
  login,
  logout,
  register,
  registerStore,
  makeAppointment,
} from "../controllers/adminAndUserControllers";
import {
  registerEmployee,
  loginEmployee,
  AppointmentList,
} from "../controllers/employeeControllers";
import { errorHandler } from "../middlewares/errorhandler";
import { checkAuth } from "../middlewares/checkAuth";
import { checkRole } from "../middlewares/checkRole";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/registerStore", checkRole, registerStore);
router.post("/CreateAppointment", checkRole, makeAppointment);
router.post("/employee/register", registerEmployee);
router.post("/employee/login", loginEmployee);

router.use(errorHandler);

export default router;
