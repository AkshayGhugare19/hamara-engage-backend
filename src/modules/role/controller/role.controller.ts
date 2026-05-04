import { Response, NextFunction } from "express";
import { AuthRequest } from "../../../types/request.type";
import {
  addRoleService,
  getRolesService,
  paginateRolesService,
  deleteRoleService,
  updateRoleService,
} from "../service/role.service";
import { successResponse } from "../../../utils/responseHandler";

export const addRole = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, description } = req.body;
    const data = await addRoleService(name, description);
    successResponse(res, 201, "Role created successfully", data);
  } catch (error) {
    next(error);
  }
};

export const getRoles = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await getRolesService();
    successResponse(res, 200, "Roles fetched successfully", data);
  } catch (error) {
    next(error);
  }
};

export const paginateRoles = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 10);

    const data = await paginateRolesService(page, limit);
    successResponse(res, 200, "Roles fetched successfully", data);
  } catch (error) {
    next(error);
  }
};

export const deleteRole = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    await deleteRoleService(id);
    successResponse(res, 200, "Role deleted successfully", null);
  } catch (error) {
    next(error);
  }
};

export const updateRole = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const data = await updateRoleService(id, req.body);
    successResponse(res, 200, "Role updated successfully", data);
  } catch (error) {
    next(error);
  }
};