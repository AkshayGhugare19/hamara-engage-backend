import { Response, NextFunction } from "express";
import { AuthRequest } from "../../../types/request.type";
import {
  getUsersService,
  getMeService,
  paginateUsersService,
  deleteUserService,
  updateUserService,
  addUserService,
} from "../service/user.service";

import { errorResponse, successResponse } from "../../../utils/responseHandler";
import { AppError } from "../../../utils/AppError";
import { UniqueConstraintError } from "sequelize";

export const addUser = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { first_name, last_name, email, username, mobile, role, status, password } = req.body;
    const data = await addUserService(first_name, last_name, email, username, mobile, role, status, password);
    return successResponse(res, 201, "User added successfully", data);
  } catch (error) {
    if (error instanceof UniqueConstraintError) {
      return errorResponse(res, 400, "User already exists");
    }

    if (error instanceof AppError) {
      return errorResponse(res, error.statusCode, error.message);
    }

    return errorResponse(res, 500, "Failed to create user");
  }
};

export const updateUser = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { first_name, last_name,email,username, mobile, status } = req.body;
    const data = await updateUserService(req.params.id, { first_name, last_name, email, username, mobile, status });
    return successResponse(res, 200, "User updated successfully", data);
  } catch (error) {
    console.log("Error updating user:", error);
    if (error instanceof UniqueConstraintError) {
      const messages = error.errors.map((err: any) => {
        if (err.path === "mobile") {
          return "Mobile number already in use";
        }
        if (err.path === "email") {
          return "Email already in use";
        }
        return `${err.path} already exists`;
      });
      return errorResponse(res, 400, messages.join(", "));
    }
    if (error instanceof AppError) {
      return errorResponse(res, error.statusCode, error.message);
    }
    return errorResponse(res, 500, "Failed to update user");
  }
};

export const getUsers = async (req: AuthRequest, res: Response) => {
  try {
    const data = await getUsersService();
    return successResponse(res, 200, "Users fetched successfully", data);
  } catch (error) {
    if (error instanceof AppError) {
      return errorResponse(res, error.statusCode, error.message);
    }
    return errorResponse(res, 500, "Failed to fetch users");
  }
};

export const me = async (req: AuthRequest, res: Response) => {
  try {
    const data = await getMeService(req.user!.id);
    return successResponse(res, 200, "Profile fetched", data);
  } catch (error) {
    if (error instanceof AppError) {
      return errorResponse(res, error.statusCode, error.message);
    }
    return errorResponse(res, 500, "Failed to fetch profile");
  }
};

export const paginateUsers = async (req: AuthRequest, res: Response) => {
  try {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 10);

    const data = await paginateUsersService(page, limit);
    return successResponse(res, 200, "Users fetched", data);
  } catch (error) {
    if (error instanceof AppError) {
      return errorResponse(res, error.statusCode, error.message);
    }
    return errorResponse(res, 500, "Failed to fetch users");
  }
};

export const deleteUser = async (req: AuthRequest, res: Response) => {
  try {
    await deleteUserService(req.params.id);
    return successResponse(res, 200, "User deleted");
  } catch (error) {
    if (error instanceof AppError) {
      return errorResponse(res, error.statusCode, error.message);
    }
    return errorResponse(res, 500, "Failed to delete user");
  }
};