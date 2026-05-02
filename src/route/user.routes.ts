import { Router } from "express";
import {
  getUsers,
  me,
  paginateUsers,
  deleteUser,
  updateUser,
  addUser,
} from "../modules/user/controller/user.controller";
import { auth } from "../middlewares/auth.middleware";
import { role } from "../middlewares/role.middleware";
import { validate } from "../middlewares/validate.middleware";
import { addOrUpdateUserSchema, paginateSchema, uuidParamSchema } from "../validations/user.validation";

const router = Router();

/**
 * @swagger
 * /api/users/add:
 *   post:
 *     summary: Add a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [first_name, last_name, email, password, mobile]
 *             properties:
 *               first_name:
 *                 type: string
 *                 example: John
 *               last_name:
 *                 type: string
 *                 example: Doe
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               mobile:
 *                 type: string
 *                 example: "9876543210"
 *               password:
 *                type: string
 *                example: sample@123
 *               username:
 *                 type: string
 *                 example: johndoe
 *               role:
 *                 type: string
 *                 enum: [USER, ADMIN]
 *                 example: USER
 *               status:
 *                 type: string
 *                 enum: [ACTIVE, INACTIVE]
 *                 example: ACTIVE
 *     responses:
 *       201:
 *         description: User registered successfully
 *       409:
 *         description: Email already exists
 *       422:
 *         description: Validation failed
 */
router.post("/add", validate(addOrUpdateUserSchema), addUser);

/**
 * @swagger
 * /api/users/update-by/{id}:
 *   post:
 *     summary: Update user by ID (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       content:
 *         application/json:
 *           example:
 *             first_name: testuser
 *             last_name: testuser
 *             email: newemail@example.com
 *             mobile: "1234567890"
 *             username: testuser
 *             role: ADMIN
 *             status: INACTIVE
 *     responses:
 *       200:
 *         description: User updated
 */
router.post(
  "/update-by/:id",
  auth,
  role("ADMIN"),
  validate(uuidParamSchema, "params"),
  updateUser
);

/**
 * @swagger
 * /api/users/me:
 *   get:
 *     summary: Get logged-in user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user profile
 *       401:
 *         description: Unauthorized
 */
router.get("/me", auth, me);

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 *       403:
 *         description: Forbidden
 */
router.get("/", auth, role("ADMIN"), getUsers);

/**
 * @swagger
 * /api/users/paginate:
 *   get:
 *     summary: Get paginated users (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *     responses:
 *       200:
 *         description: Paginated users list
 */
router.get(
  "/paginate",
  auth,
  role("ADMIN"),
  validate(paginateSchema, "query"),
  paginateUsers
);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Delete user by ID (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: User deleted
 *       404:
 *         description: User not found
 */
router.delete(
  "/:id",
  auth,
  role("ADMIN"),
  validate(uuidParamSchema, "params"),
  deleteUser
);



export default router;
