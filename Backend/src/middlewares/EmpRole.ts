import express, { Express, NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { Employee, User } from "../models/SchemaModels";

export const EmpRole = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const Emp: any = await Employee.findById(req.EmpId);

  if (Emp.role === "emp") {
    req.isEmployee = true;
    return next();
  }
  req.isEmployee = false;
  return next();
};
