import { configDotenv } from "dotenv";
import express, { Express, NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
require("dotenv").config();

export const checkAuth = (req: Request, res: Response, next: NextFunction) => {
  const authToken = req.cookies.authToken;
  const refreshToken = req.cookies.refreshToken;
  if (!authToken || !refreshToken) {
    return res.status(401).json({
      message: "Error:  No Token provided ",
    });
  }
  const jwt_secret = process.env.JWT_SECRET_TOKEN;
  jwt.verify(authToken, jwt_secret || "", (err: any, decode: any) => {
    if (err) {
      jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_TOKEN || "",
        (refreshErr: any, refreshDecode: any) => {
          if (refreshErr) {
            return res.status(401).json({
              message: " Invalid tokens",
            });
          } else {
            const newAuthToken = jwt.sign(
              { userId: refreshDecode.userId },
              process.env.JWT_SECRET_TOKEN || "",
              { expiresIn: "1d" }
            );
            const newRefreshToken = jwt.sign(
              { userId: refreshDecode.userId },
              process.env.JWT_REFRESH_TOKEN || "",
              { expiresIn: "2d" }
            );

            res.cookie("authToken", newAuthToken);
            res.cookie("refreshToken", newRefreshToken);
            console.log(refreshDecode.userId, "_____");
            req.userId = refreshDecode.userId;
            next();
          }
        }
      );
    } else {
      req.userId = decode.userId;
      next();
    }
  });
};
