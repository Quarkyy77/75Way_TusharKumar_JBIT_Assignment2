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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeAppointment = exports.registerStore = exports.logout = exports.login = exports.register = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const SchemaModels_1 = require("../models/SchemaModels");
//Register new user as user/ admin
const register = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, email, password, role } = req.body;
        const existingUser = yield SchemaModels_1.User.findOne({ email });
        // Checking if user already exists or not
        if (existingUser) {
            return res
                .status(409)
                .json({ ok: false, message: "User already exists" });
        }
        const emailFormat = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
        if (email !== "" && !email.match(emailFormat)) {
            return res.status(400).json({
                ok: false,
                message: "Invalid email format",
            });
        }
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({
                ok: false,
                message: "Invalid password format. It should contain at least 8 characters, one uppercase letter, one digit, and one special character.",
            });
        }
        const salt = bcrypt_1.default.genSaltSync(10);
        const hashedPassword = bcrypt_1.default.hashSync(password, salt);
        //Storing password in database
        const newUser = new SchemaModels_1.User({
            username,
            email,
            password: hashedPassword,
            role,
        });
        yield newUser.save();
        return res
            .status(201)
            .json({ ok: true, message: "User is created Successfully", newUser });
    }
    catch (err) {
        next(err);
    }
});
exports.register = register;
//login for user/admin
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, role } = req.body;
        const user = yield SchemaModels_1.User.findOne({ email });
        // Checking if the email exists in database
        if (!user) {
            return res
                .status(400)
                .json({ ok: false, message: "Invalid Credentials" });
        }
        if (role != user.role) {
            return res.status(400).json({ ok: false, message: "Invalid Role" });
        }
        // comapring password entered with database hashed Password
        const isPasswordMatch = yield bcrypt_1.default.compare(password, user.password);
        if (!isPasswordMatch) {
            return res
                .status(400)
                .json({ ok: false, message: "Invalid Credentials" });
        }
        // Generating tokens
        const authToken = jsonwebtoken_1.default.sign({ userId: user._id }, process.env.JWT_SECRET_KEY || " ", { expiresIn: "30m" });
        const refreshToken = jsonwebtoken_1.default.sign({ userId: user._id }, process.env.JWT_REFRESH_SECRET_KEY || " ", { expiresIn: "2h" });
        // Saving tokens in cookies
        res.cookie("authToken", authToken, { httpOnly: true });
        res.cookie("refreshToken", refreshToken, { httpOnly: true });
        return res
            .status(200)
            .json({ ok: true, message: "Login Successful", userid: user.id });
    }
    catch (err) {
        next(err);
    }
});
exports.login = login;
//LOgout Functionality for the user/admin
const logout = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.clearCookie("authToken");
        res.clearCookie("refreshToken");
        return res
            .status(200)
            .json({ ok: true, message: "User has been logged out" });
    }
    catch (err) {
        next(err);
    }
});
exports.logout = logout;
//Register a store by admin
const registerStore = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.isAdmin !== true) {
            return res.status(409).json({
                ok: false,
                message: "You must be an admin for this opeartion",
            });
        }
        const { name, openTime, closeTime, numOfEmployees } = req.body;
        const existingStore = yield SchemaModels_1.Store.findOne({});
        // Checking if user already exists or not
        if (existingStore) {
            return res
                .status(409)
                .json({ ok: false, message: "Store already exists" });
        }
        const newStore = new SchemaModels_1.Store({
            name,
            openTime,
            closeTime,
            numOfEmployees,
        });
        yield newStore.save();
        return res
            .status(201)
            .json({ ok: true, message: "Store is created Successfully", newStore });
    }
    catch (err) {
        next(err);
    }
});
exports.registerStore = registerStore;
//BookAppointment
const makeAppointment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.isAdmin !== false) {
            return res.status(409).json({
                ok: false,
                message: "You must be an user for booking the appointment",
            });
        }
        const { user, store, status } = req.body;
        const existingAppointmentByUser = yield SchemaModels_1.Appointment.findOne({ user });
        const existingAppointmentByStatus = yield SchemaModels_1.Appointment.findOne({ status });
        const existingAppointmentByStore = yield SchemaModels_1.Appointment.findOne({ store });
        // Checking if appointment already exists or not
        if (existingAppointmentByUser) {
            return res.status(409).json({
                ok: false,
                message: "Appointment already exists by your name",
            });
        }
        if ((existingAppointmentByStatus === null || existingAppointmentByStatus === void 0 ? void 0 : existingAppointmentByStatus.status) === "NOT-AVAILABLE") {
            return res.status(409).json({
                ok: false,
                message: "Employee is  Not Available ",
            });
        }
        if (existingAppointmentByStore) {
            //TODO
        }
        const newAppointment = new SchemaModels_1.Appointment({
            user,
            store,
        });
        yield newAppointment.save();
        return res.status(201).json({
            ok: true,
            message: "Store is created Successfully",
            newAppointment,
        });
    }
    catch (err) {
        next(err);
    }
});
exports.makeAppointment = makeAppointment;
