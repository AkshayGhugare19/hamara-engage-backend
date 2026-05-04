import { Router } from "express";
import {
  addLog,
  getLogs,
  getLogById,
  paginateLogs,
  updateLog,
  deleteLog,
} from "../modules/user-log/controller/user-log.controller";

import { auth } from "../middlewares/auth.middleware";
import { role } from "../middlewares/role.middleware";
import { validate } from "../middlewares/validate.middleware";

import {
  addUserLogSchema,
  updateUserLogSchema,
  userLogIdParamSchema,
} from "../validations/user-log.validation";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: User Logs
 *   description: Audit logs management APIs
 */

 /**
 * @swagger
 * /api/user-log/add:
 *   post:
 *     summary: Create a user log
 *     tags: [User Logs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [user_id, action]
 *             properties:
 *               user_id:
 *                 type: string
 *                 format: uuid
 *                 example: 550e8400-e29b-41d4-a716-446655440000
 *               action:
 *                 type: string
 *                 enum: [INSERT, UPDATE, DELETE, LOGIN]
 *                 example: INSERT
 *               product:
 *                 type: string
 *                 example: CRM
 *               sub_product:
 *                 type: string
 *                 example: USER_MODULE
 *               subject:
 *                 type: string
 *                 example: User created
 *               details:
 *                 type: string
 *                 example: Created new user successfully
 *               old_data:
 *                 type: object
 *                 example: {}
 *               new_data:
 *                 type: object
 *                 example:
 *                   id: "u_101"
 *                   name: "Akshay Ghugare"
 *                   email: "akshay@example.com"
 *                   role: "ADMIN"
 *
 *     responses:
 *       201:
 *         description: Log created successfully
 *       400:
 *         description: Validation error
 */
router.post("/add", auth, validate(addUserLogSchema), addLog);

/**
 * @swagger
 * /api/user-log:
 *   get:
 *     summary: Get all logs (Admin only)
 *     tags: [User Logs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of logs
 */
router.get("/", auth, role("ADMIN"), getLogs);

/**
 * @swagger
 * /api/user-log/paginate:
 *   get:
 *     summary: Get paginated logs with filters
 *     tags: [User Logs]
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
 *       - in: query
 *         name: user_id
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: action
 *         schema:
 *           type: string
 *           enum: [INSERT, UPDATE, DELETE, LOGIN]
 *       - in: query
 *         name: product
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Paginated logs fetched successfully
 */
router.get("/paginate", auth, role("ADMIN"), paginateLogs);

/**
 * @swagger
 * /api/user-log/{id}:
 *   get:
 *     summary: Get log by ID
 *     tags: [User Logs]
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
 *         description: Log details
 *       404:
 *         description: Log not found
 */
router.get(
  "/:id",
  auth,
  role("ADMIN"),
  validate(userLogIdParamSchema, "params"),
  getLogById
);

/**
 * @swagger
 * /api/user-log/update-by/{id}:
 *   post:
 *     summary: Update log (Admin only - not recommended)
 *     tags: [User Logs]
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
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             action: UPDATE
 *             product: CRM
 *             subject: Updated user info
 *             details: User updated successfully
 *     responses:
 *       200:
 *         description: Log updated successfully
 *       404:
 *         description: Log not found
 */
router.post(
  "/update-by/:id",
  auth,
  role("ADMIN"),
  validate(userLogIdParamSchema, "params"),
  validate(updateUserLogSchema),
  updateLog
);

/**
 * @swagger
 * /api/user-log/{id}:
 *   delete:
 *     summary: Delete log (Admin only - not recommended)
 *     tags: [User Logs]
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
 *         description: Log deleted successfully
 *       404:
 *         description: Log not found
 */
router.delete(
  "/:id",
  auth,
  role("ADMIN"),
  validate(userLogIdParamSchema, "params"),
  deleteLog
);

export default router;