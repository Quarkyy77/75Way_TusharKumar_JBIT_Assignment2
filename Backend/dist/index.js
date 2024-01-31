"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const adminAnduserRoutes_1 = __importDefault(require("./routes/adminAnduserRoutes"));
const employeeRoutes_1 = __importDefault(require("./routes/employeeRoutes"));
require("./db");
const app = (0, express_1.default)();
const PORT = process.env.PORT;
require("dotenv").config();
app.use((0, cors_1.default)());
app.use((0, cookie_parser_1.default)());
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({
    extended: true,
}));
app.use("/api/User", adminAnduserRoutes_1.default);
app.use("/api/employee", employeeRoutes_1.default);
app.listen(PORT, () => {
    console.log("server is running on", PORT);
});
