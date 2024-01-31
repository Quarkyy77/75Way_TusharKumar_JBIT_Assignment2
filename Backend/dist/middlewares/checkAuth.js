"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require("dotenv").config();
const checkAuth = (req, res, next) => {
    const authToken = req.cookies.authToken;
    const refreshToken = req.cookies.refreshToken;
    if (!authToken || !refreshToken) {
        return res.status(401).json({
            message: "Error:  No Token provided ",
        });
    }
    const jwt_secret = process.env.JWT_SECRET_TOKEN;
    jsonwebtoken_1.default.verify(authToken, jwt_secret || "", (err, decode) => {
        if (err) {
            jsonwebtoken_1.default.verify(refreshToken, process.env.JWT_REFRESH_TOKEN || "", (refreshErr, refreshDecode) => {
                if (refreshErr) {
                    return res.status(401).json({
                        message: " Invalid tokens",
                    });
                }
                else {
                    const newAuthToken = jsonwebtoken_1.default.sign({ userId: refreshDecode.userId }, process.env.JWT_SECRET_TOKEN || "", { expiresIn: "1d" });
                    const newRefreshToken = jsonwebtoken_1.default.sign({ userId: refreshDecode.userId }, process.env.JWT_REFRESH_TOKEN || "", { expiresIn: "2d" });
                    res.cookie("authToken", newAuthToken);
                    res.cookie("refreshToken", newRefreshToken);
                    console.log(refreshDecode.userId, "_____");
                    req.userId = refreshDecode.userId;
                    next();
                }
            });
        }
        else {
            req.userId = decode.userId;
            next();
        }
    });
};
exports.checkAuth = checkAuth;
