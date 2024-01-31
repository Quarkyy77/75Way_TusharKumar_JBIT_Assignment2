import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

import cookieparser from "cookie-parser";
import cron from "node-cron";
import AdminAndUserRoutes from "./routes/adminAnduserRoutes";

import employeeRoutes from "./routes/employeeRoutes";

require("./db");

const app = express();
const PORT = process.env.PORT;

require("dotenv").config();

declare global {
  namespace Express {
    interface Request {
      userId?: string;
      EmpId?: string;
      isAdmin: Boolean;
      isEmployee: Boolean;
    }
  }
}

app.use(cors());
app.use(cookieparser());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use("/api/User", AdminAndUserRoutes);

app.use("/api/employee", employeeRoutes);

app.listen(PORT, () => {
  console.log("server is running on", PORT);
});
