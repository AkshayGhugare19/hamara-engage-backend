import { Request, Response, NextFunction } from "express";
import { registerService, loginService } from "../service/auth.service";
import { successResponse } from "../../../utils/responseHandler";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { first_name, last_name, email, password, mobile } = req.body;

    const data = await registerService(first_name, last_name, email, password, mobile);

    successResponse(res, 201, "User registered successfully", data);
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;

    const data = await loginService(email, password);

    successResponse(res, 200, "Login successful", data);
  } catch (error) {
    next(error);
  }
};
