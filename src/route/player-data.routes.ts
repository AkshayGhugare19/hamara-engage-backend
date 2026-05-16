import { Router } from "express";
import {
  createPlayerData,
  bulkCreatePlayerData,
  paginatePlayerData,
  updatePlayerData,
  deletePlayerData,
} from "../modules/player-data/controller/player-data.controller";
import { auth } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import {
  createPlayerDataSchema,
  bulkCreatePlayerDataSchema,
  updatePlayerDataSchema,
  playerDataIdParamSchema,
} from "../validations/player-data.validation";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: PlayerData
 *   description: CRM Player Data & Custom Data APIs
 */

/**
 * @swagger
 * /api/player-data/add:
 *   post:
 *     summary: Create a custom data field
 *     tags: [PlayerData]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, data_type]
 *             properties:
 *               name: { type: string }
 *               description: { type: string }
 *               data_type: { type: string, enum: [STRING, BOOLEAN, NUMBER, DATE] }
 *               data_option: { type: string }
 *     responses:
 *       200: { description: Custom data created successfully }
 */
router.post("/add", auth, validate(createPlayerDataSchema), createPlayerData);

/**
 * @swagger
 * /api/player-data/bulk:
 *   post:
 *     summary: Bulk import custom data fields (CSV upload)
 *     tags: [PlayerData]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [rows]
 *             properties:
 *               rows:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name: { type: string }
 *                     description: { type: string }
 *                     data_type: { type: string }
 *     responses:
 *       200: { description: Custom data imported successfully }
 */
router.post(
  "/bulk",
  auth,
  validate(bulkCreatePlayerDataSchema),
  bulkCreatePlayerData
);

/**
 * @swagger
 * /api/player-data/paginate:
 *   get:
 *     summary: Get paginated player data (filter is_custom for Custom vs system fields)
 *     tags: [PlayerData]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: query, name: page, schema: { type: integer } }
 *       - { in: query, name: limit, schema: { type: integer } }
 *       - { in: query, name: search, schema: { type: string } }
 *       - { in: query, name: data_type, schema: { type: string } }
 *       - { in: query, name: is_custom, schema: { type: boolean } }
 *     responses:
 *       200: { description: Player data fetched successfully }
 */
router.get("/paginate", auth, paginatePlayerData);

/**
 * @swagger
 * /api/player-data/update-by/{id}:
 *   post:
 *     summary: Update a custom data field
 *     tags: [PlayerData]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200: { description: Custom data updated successfully }
 */
router.post(
  "/update-by/:id",
  auth,
  validate(playerDataIdParamSchema, "params"),
  validate(updatePlayerDataSchema, "body"),
  updatePlayerData
);

/**
 * @swagger
 * /api/player-data/{id}:
 *   delete:
 *     summary: Delete a custom data field
 *     tags: [PlayerData]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200: { description: Custom data deleted successfully }
 */
router.delete(
  "/:id",
  auth,
  validate(playerDataIdParamSchema, "params"),
  deletePlayerData
);

export default router;
