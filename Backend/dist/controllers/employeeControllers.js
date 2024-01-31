"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentList = exports.loginEmployee = exports.registerEmployee = void 0;
const SchemaModels_1 = require("../models/SchemaModels");
//employee register using username
const registerEmployee = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username } = req.body;
        const existingEmployee = yield SchemaModels_1.User.findOne({ username });
        if (existingEmployee) {
            return res
                .status(409)
                .json({ ok: false, message: "Employee already exists" });
        }
        const newEmployee = new SchemaModels_1.Employee({
            username,
        });
        yield newEmployee.save();
        return res.status(201).json({
            ok: true,
            message: "Employee is created Successfully",
            newEmployee,
        });
    }
    catch (err) {
        next(err);
    }
});
exports.registerEmployee = registerEmployee;
//Employee login
const loginEmployee = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username } = req.body;
        const employee = yield SchemaModels_1.Employee.findOne({ username });
        // Checking if the username of employee exists in database
        if (!employee) {
            return res.status(400).json({ ok: false, message: "Invalid Credential" });
        }
        return res
            .status(200)
            .json({ ok: true, message: "Login Successful", userid: employee.id });
    }
    catch (err) {
        next(err);
    }
});
exports.loginEmployee = loginEmployee;
//Check Appointments for the Employee
const AppointmentList = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username } = req.body;
        const employee = yield SchemaModels_1.Employee.findOne({ username });
        if (req.isEmployee !== true) {
            return res.status(409).json({
                ok: false,
                message: "You must be an employee for this opeartion",
            });
        }
        const Appointment = employee === null || employee === void 0 ? void 0 : employee.assignedAppointments;
        res.status(200).json({ ok: true, Appointment });
    }
    catch (err) {
        console.log(err);
        next(err);
    }
});
exports.AppointmentList = AppointmentList;
