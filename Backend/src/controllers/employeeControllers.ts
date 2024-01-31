import { RequestHandler } from "express";
import { User, Store, Appointment, Employee } from "../models/SchemaModels";

//employee register using username
export const registerEmployee: RequestHandler = async (req, res, next) => {
  try {
    const { username } = req.body;
    const existingEmployee = await User.findOne({ username });
    if (existingEmployee) {
      return res
        .status(409)
        .json({ ok: false, message: "Employee already exists" });
    }
    const newEmployee: any = new Employee({
      username,
    });
    await newEmployee.save();
    return res.status(201).json({
      ok: true,
      message: "Employee is created Successfully",
      newEmployee,
    });
  } catch (err) {
    next(err);
  }
};

//Employee login
export const loginEmployee: RequestHandler = async (req, res, next) => {
  try {
    const { username } = req.body;

    const employee = await Employee.findOne({ username });

    // Checking if the username of employee exists in database
    if (!employee) {
      return res.status(400).json({ ok: false, message: "Invalid Credential" });
    }
    return res
      .status(200)
      .json({ ok: true, message: "Login Successful", userid: employee.id });
  } catch (err) {
    next(err);
  }
};

//Check Appointments for the Employee
export const AppointmentList: RequestHandler = async (req, res, next) => {
  try {
    const { username } = req.body;

    const employee = await Employee.findOne({ username });
    if (req.isEmployee !== true) {
      return res.status(409).json({
        ok: false,
        message: "You must be an employee for this opeartion",
      });
    }
    const Appointment = employee?.assignedAppointments;
    res.status(200).json({ ok: true, Appointment });
  } catch (err) {
    console.log(err);
    next(err);
  }
};
