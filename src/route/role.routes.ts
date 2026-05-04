import { Router } from "express";
import {
  addRole,
  getRoles,
  paginateRoles,
  deleteRole,
  updateRole,
} from "../modules/role/controller/role.controller";
import { auth } from "../middlewares/auth.middleware";
import { role } from "../middlewares/role.middleware";
import { validate } from "../middlewares/validate.middleware";
import { uuidParamSchema, paginateSchema } from "../validations/user.validation";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Roles
 *   description: Role management APIs
 */

/**
 * @swagger
 * /api/roles/add:
 *   post:
 *     summary: Create a new role (Admin only)
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *                 example: MANAGER
 *               description:
 *                 type: string
 *                 example: Manager role with limited access
 *     responses:
 *       201:
 *         description: Role created successfully
 *       409:
 *         description: Role already exists
 */
router.post("/add", auth, role("ADMIN"), addRole);

/**
 * @swagger
 * /api/roles:
 *   get:
 *     summary: Get all roles (Admin only)
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of roles
 */
router.get("/", auth, role("ADMIN"), getRoles);

/**
 * @swagger
 * /api/roles/paginate:
 *   get:
 *     summary: Get paginated roles (Admin only)
 *     tags: [Roles]
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
 *         description: Paginated roles list
 */
router.get(
  "/paginate",
  auth,
  role("ADMIN"),
  validate(paginateSchema, "query"),
  paginateRoles
);

/**
 * @swagger
 * /api/roles/update-by/{id}:
 *   post:
 *     summary: Update role by ID (Admin only)
 *     tags: [Roles]
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
 *             name: MANAGER
 *             description: Updated role description
 *             status: ACTIVE
 *     responses:
 *       200:
 *         description: Role updated successfully
 *       404:
 *         description: Role not found
 */
router.post(
  "/update-by/:id",
  auth,
  role("ADMIN"),
  validate(uuidParamSchema, "params"),
  updateRole
);

/**
 * @swagger
 * /api/roles/{id}:
 *   delete:
 *     summary: Delete role by ID (Admin only)
 *     tags: [Roles]
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
 *         description: Role deleted successfully
 *       404:
 *         description: Role not found
 */
router.delete(
  "/:id",
  auth,
  role("ADMIN"),
  validate(uuidParamSchema, "params"),
  deleteRole
);

export default router;