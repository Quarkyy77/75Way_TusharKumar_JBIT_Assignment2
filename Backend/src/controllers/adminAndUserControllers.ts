import { RequestHandler } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User, Store, Appointment, Employee } from "../models/SchemaModels";

//Register new user as user/ admin
export const register: RequestHandler = async (req, res, next) => {
  try {
    const { username, email, password, role } = req.body;
    const existingUser = await User.findOne({ email });

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

    const passwordRegex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        ok: false,
        message:
          "Invalid password format. It should contain at least 8 characters, one uppercase letter, one digit, and one special character.",
      });
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    //Storing password in database
    const newUser: any = new User({
      username,
      email,
      password: hashedPassword,
      role,
    });

    await newUser.save();
    return res
      .status(201)
      .json({ ok: true, message: "User is created Successfully", newUser });
  } catch (err) {
    next(err);
  }
};

//login for user/admin
export const login: RequestHandler = async (req, res, next) => {
  try {
    const { email, password, role } = req.body;

    const user = await User.findOne({ email });

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
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res
        .status(400)
        .json({ ok: false, message: "Invalid Credentials" });
    }

    // Generating tokens
    const authToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET_TOKEN || " ",
      { expiresIn: "30m" }
    );
    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_REFRESH_SECRET_TOKEN || " ",
      { expiresIn: "2h" }
    );

    // Saving tokens in cookies
    res.cookie("authToken", authToken, { httpOnly: true });
    res.cookie("refreshToken", refreshToken, { httpOnly: true });

    return res
      .status(200)
      .json({ ok: true, message: "Login Successful", userid: user.id });
  } catch (err) {
    next(err);
  }
};

//LOgout Functionality for the user/admin
export const logout: RequestHandler = async (req, res, next) => {
  try {
    res.clearCookie("authToken");
    res.clearCookie("refreshToken");

    return res
      .status(200)
      .json({ ok: true, message: "User has been logged out" });
  } catch (err) {
    next(err);
  }
};

//Register a store by admin
export const registerStore: RequestHandler = async (req, res, next) => {
  try {
    if (req.isAdmin !== true) {
      return res.status(409).json({
        ok: false,
        message: "You must be an admin for this opeartion",
      });
    }

    const { name, openTime, closeTime, numOfEmployees } = req.body;

    const existingStore = await Store.findOne({});

    // Checking if user already exists or not
    if (existingStore) {
      return res
        .status(409)
        .json({ ok: false, message: "Store already exists" });
    }

    const newStore: any = new Store({
      name,
      openTime,
      closeTime,
      numOfEmployees,
    });
    await newStore.save();
    return res
      .status(201)
      .json({ ok: true, message: "Store is created Successfully", newStore });
  } catch (err) {
    next(err);
  }
};

//BookAppointment
export const makeAppointment: RequestHandler = async (req, res, next) => {
  try {
    if (req.isAdmin !== false) {
      return res.status(409).json({
        ok: false,
        message: "You must be an user for booking the appointment",
      });
    }

    const { user, store, status } = req.body;

    const existingAppointmentByUser = await Appointment.findOne({ user });
    const existingAppointmentByStatus = await Appointment.findOne({ status });
    const existingAppointmentByStore = await Appointment.findOne({ store });

    // Checking if appointment already exists or not
    if (existingAppointmentByUser) {
      return res.status(409).json({
        ok: false,
        message: "Appointment already exists by your name",
      });
    }
    if (existingAppointmentByStatus?.status === "NOT-AVAILABLE") {
      return res.status(409).json({
        ok: false,
        message: "Employee is  Not Available ",
      });
    }
    if (existingAppointmentByStore) {
      //TODO
    }

    const newAppointment: any = new Appointment({
      user,
      store,
    });
    await newAppointment.save();
    return res.status(201).json({
      ok: true,
      message: "Store is created Successfully",
      newAppointment,
    });
  } catch (err) {
    next(err);
  }
};
