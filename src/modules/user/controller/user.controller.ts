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
import { successResponse } from "../../../utils/responseHandler";

export const addUser = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { first_name, last_name, email, username, mobile, role, status, password } = req.body;
    const data = await addUserService(first_name, last_name, email, username, mobile, role, status, password);
    successResponse(res, 201, "User added successfully", data);
  } catch (error) {
    next(error);
  }
}

export const getUsers = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const data = await getUsersService();
    successResponse(res, 200, "Users fetched successfully", data);
  } catch (error) {
    next(error);
  }
};

export const me = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const data = await getMeService(req.user!.id);
    successResponse(res, 200, "Profile fetched successfully", data);
  } catch (error) {
    next(error);
  }
};

export const paginateUsers = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 10);

    const data = await paginateUsersService(page, limit);
    successResponse(res, 200, "Users fetched successfully", data);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    await deleteUserService(id);
    successResponse(res, 200, "User deleted successfully", null);
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const data = await updateUserService(id, req.body);
    successResponse(res, 200, "User updated successfully", data);
  } catch (error) {
    next(error);
  }
};
