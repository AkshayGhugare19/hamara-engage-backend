import UserRepository from "../model/user.repository";
import bcrypt from "bcryptjs";

import { AppError } from "../../../utils/AppError";
import { sendMail } from "../../../utils/mailService";
export const addUserService = async (
  first_name: string,
  last_name: string,
  email: string,
  username: string,
  mobile: string,
  role: "USER" | "ADMIN",
  status: "ACTIVE" | "INACTIVE",
  password: string
) => {
  // Check if email already exists
  const existing = await UserRepository.findOne({ email });
  if (existing) {
    throw new AppError("Email already exists", 409);
  }

  // Check if mobile already exists 
  const existingMobile = await UserRepository.findOne({ mobile });
  if (existingMobile) {
    throw new AppError("Mobile number already registered", 409);
  }
  const passwordHash = password || "sample@123"; // Default password if not provided
  const hash = await bcrypt.hash(passwordHash, 12);
  const user = await UserRepository.create({
    first_name,
    last_name,
    email,
    password: hash,
    username,
    mobile,
    role,
    status,
  });
  // temporayy commenting out email sending to avoid issues during testing
    // if (user) {
    //   await sendMail({
    //     to: email,
    //     subject: "Welcome to Our App",
    //     template: "welcome", 
    //     data: { 
    //       first_name, 
    //       email, 
    //       password: passwordHash,
    //       login_link: "http://localhost:5173/login", 
    //       reset_password_link: `http://localhost:5173/reset-password?email=${email}` 
    //     }, 
    //   });
    // }
  return user;
}

export const getUsersService = async () => {
  return UserRepository.findAllUsers();
};

export const getMeService = async (id: string) => {
  const user = await UserRepository.findByPk(id);
  if (!user) {
    throw new AppError("User not found", 404);
  }
  return user;
};

export const paginateUsersService = async (page: number, limit: number) => {
  return UserRepository.paginateUsers(page, limit);
};

export const deleteUserService = async (id: string) => {
  const user = await UserRepository.findByPk(id);
  if (!user) {
    throw new AppError("User not found", 404);
  }
  await UserRepository.deleteByPk(id);
  return null;
};

export const updateUserService = async (
  id: string,
  data: { first_name?: string; last_name?: string; email?: string; username?: string; mobile?: string; status?: "ACTIVE" | "INACTIVE" }
) => {
  // Uses BaseRepository.updateByPk — ORM method
  const updated = await UserRepository.updateByPk(id, data);
  if (!updated) {
    throw new AppError("User not found", 404);
  }
  return updated;
};
