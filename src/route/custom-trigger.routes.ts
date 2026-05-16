import { Router } from "express";
import {
  createCustomTrigger,
  paginateCustomTriggers,
  getCustomTrigger,
  updateCustomTrigger,
  archiveCustomTrigger,
  restoreCustomTrigger,
  deleteCustomTrigger,
} from "../modules/custom-trigger/controller/custom-trigger.controller";
import { auth } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import {
  createCustomTriggerSchema,
  updateCustomTriggerSchema,
  customTriggerIdParamSchema,
} from "../validations/custom-trigger.validation";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: CustomTriggers
 *   description: CRM Custom Trigger management APIs
 */

/**
 * @swagger
 * /api/custom-triggers/add:
 *   post:
 *     summary: Create a new custom trigger
 *     tags: [CustomTriggers]
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
 *               name: { type: string, example: First Deposit Bonus }
 *               trigger: { type: string, example: "Event: First Deposit" }
 *               status: { type: string, enum: [ACTIVE, INACTIVE] }
 *               description: { type: string }
 *               tags: { type: array, items: { type: string } }
 *               builder: { type: object }
 *     responses:
 *       200:
 *         description: Custom trigger created successfully
 */
router.post(
  "/add",
  auth,
  validate(createCustomTriggerSchema),
  createCustomTrigger
);

/**
 * @swagger
 * /api/custom-triggers/paginate:
 *   get:
 *     summary: Get paginated custom triggers (search, trigger, status, tag, archived filters)
 *     tags: [CustomTriggers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - { in: query, name: page, schema: { type: integer, example: 1 } }
 *       - { in: query, name: limit, schema: { type: integer, example: 10 } }
 *       - { in: query, name: search, schema: { type: string } }
 *       - { in: query, name: trigger, schema: { type: string } }
 *       - { in: query, name: status, schema: { type: string } }
 *       - { in: query, name: tag, schema: { type: string } }
 *       - { in: query, name: archived, schema: { type: boolean } }
 *     responses:
 *       200:
 *         description: Paginated custom triggers list
 */
router.get("/paginate", auth, paginateCustomTriggers);

/**
 * @swagger
 * /api/custom-triggers/{id}:
 *   get:
 *     summary: Get a single custom trigger by ID
 *     tags: [CustomTriggers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200: { description: Custom trigger fetched successfully }
 *       404: { description: Custom trigger not found }
 */
router.get(
  "/:id",
  auth,
  validate(customTriggerIdParamSchema, "params"),
  getCustomTrigger
);

/**
 * @swagger
 * /api/custom-triggers/update-by/{id}:
 *   post:
 *     summary: Update custom trigger by ID
 *     tags: [CustomTriggers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200: { description: Custom trigger updated successfully }
 *       404: { description: Custom trigger not found }
 */
router.post(
  "/update-by/:id",
  auth,
  validate(customTriggerIdParamSchema, "params"),
  validate(updateCustomTriggerSchema, "body"),
  updateCustomTrigger
);

/**
 * @swagger
 * /api/custom-triggers/archive/{id}:
 *   post:
 *     summary: Archive a custom trigger
 *     tags: [CustomTriggers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200: { description: Custom trigger archived successfully }
 */
router.post(
  "/archive/:id",
  auth,
  validate(customTriggerIdParamSchema, "params"),
  archiveCustomTrigger
);

/**
 * @swagger
 * /api/custom-triggers/restore/{id}:
 *   post:
 *     summary: Restore an archived custom trigger
 *     tags: [CustomTriggers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200: { description: Custom trigger restored successfully }
 */
router.post(
  "/restore/:id",
  auth,
  validate(customTriggerIdParamSchema, "params"),
  restoreCustomTrigger
);

/**
 * @swagger
 * /api/custom-triggers/{id}:
 *   delete:
 *     summary: Delete custom trigger by ID
 *     tags: [CustomTriggers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200: { description: Custom trigger deleted successfully }
 *       404: { description: Custom trigger not found }
 */
router.delete(
  "/:id",
  auth,
  validate(customTriggerIdParamSchema, "params"),
  deleteCustomTrigger
);

export default router;
