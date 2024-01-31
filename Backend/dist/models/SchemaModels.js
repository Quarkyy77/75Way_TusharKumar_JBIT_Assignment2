"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Employee = exports.Appointment = exports.User = exports.Store = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
// User Schema
const userSchema = new mongoose_1.default.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
        enum: ["admin", "user", "employee"],
        default: "user",
    },
    assignedAppointments: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Appointment",
        },
    ],
}, { timestamps: true });
// Store Schema
const storeSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
    },
    openTime: {
        type: String,
        required: true,
    },
    closeTime: {
        type: String,
        required: true,
    },
    numOfEmployees: {
        type: Number,
        required: true,
    },
    employees: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Employee",
        },
    ],
    appointments: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Appointment",
        },
    ],
}, { timestamps: true });
// Appointment Schema
const appointmentSchema = new mongoose_1.default.Schema({
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    store: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Store",
        required: true,
    },
    employee: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Employee",
    },
    status: {
        type: String,
        enum: ["NOT-AVAILABLE", "END", "START"],
        default: "START",
    },
    startTime: { type: Date, default: Date.now },
});
// Employee Schema
const employeeSchema = new mongoose_1.default.Schema({
    role: { type: String, default: "Emp" },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    assignedAppointments: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Appointment",
        },
    ],
}, { timestamps: true });
const Store = mongoose_1.default.model("Store", storeSchema);
exports.Store = Store;
const User = mongoose_1.default.model("User", userSchema);
exports.User = User;
const Appointment = mongoose_1.default.model("Appointment", appointmentSchema);
exports.Appointment = Appointment;
const Employee = mongoose_1.default.model("Employee", employeeSchema);
exports.Employee = Employee;
