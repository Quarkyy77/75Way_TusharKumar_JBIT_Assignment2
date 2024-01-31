import express, { Express, NextFunction, Request, Response } from "express";

import { User } from "../models/SchemaModels";

export const checkRole = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user: any = await User.findById(req.userId);

  if (user.role === "admin") {
    req.isAdmin = true;
    return next();
  }
  req.isAdmin = false;
  return next();
};
