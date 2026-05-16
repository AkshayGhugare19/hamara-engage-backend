import { Router } from "express";
import {
  createFrequencyCap,
  paginateFrequencyCaps,
  getFrequencyCap,
  updateFrequencyCap,
  deleteFrequencyCap,
} from "../modules/frequency-cap/controller/frequency-cap.controller";
import { auth } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import {
  createFrequencyCapSchema,
  updateFrequencyCapSchema,
  frequencyCapIdParamSchema,
} from "../validations/frequency-cap.validation";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: FrequencyCaps
 *   description: CRM Frequency Cap management APIs
 */

/**
 * @swagger
 * /api/frequency-caps/add:
 *   post:
 *     summary: Create a frequency cap
 *     tags: [FrequencyCaps]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [channel, period, limit]
 *             properties:
 *               channel: { type: string, enum: [EMAIL, SMS, ONSITE, WEBPUSH, INAPP] }
 *               period: { type: string, enum: [PER_DAY, PER_WEEK, PER_MONTH] }
 *               limit: { type: integer, example: 3 }
 *     responses:
 *       200: { description: Frequency cap created successfully }
 */
router.post(
  "/add",
  auth,
  validate(createFrequencyCapSchema),
  createFrequencyCap
);

/**
 * @swagger
 * /api/frequency-caps/paginate:
 *   get:
 *     summary: Get paginated frequency caps
 *     tags: [FrequencyCaps]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: query, name: page, schema: { type: integer } }
 *       - { in: query, name: limit, schema: { type: integer } }
 *       - { in: query, name: search, schema: { type: string } }
 *       - { in: query, name: channel, schema: { type: string } }
 *       - { in: query, name: period, schema: { type: string } }
 *     responses:
 *       200: { description: Paginated frequency caps list }
 */
router.get("/paginate", auth, paginateFrequencyCaps);

/**
 * @swagger
 * /api/frequency-caps/{id}:
 *   get:
 *     summary: Get a single frequency cap
 *     tags: [FrequencyCaps]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200: { description: Frequency cap fetched successfully }
 *       404: { description: Frequency cap not found }
 */
router.get(
  "/:id",
  auth,
  validate(frequencyCapIdParamSchema, "params"),
  getFrequencyCap
);

/**
 * @swagger
 * /api/frequency-caps/update-by/{id}:
 *   post:
 *     summary: Update a frequency cap
 *     tags: [FrequencyCaps]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200: { description: Frequency cap updated successfully }
 */
router.post(
  "/update-by/:id",
  auth,
  validate(frequencyCapIdParamSchema, "params"),
  validate(updateFrequencyCapSchema, "body"),
  updateFrequencyCap
);

/**
 * @swagger
 * /api/frequency-caps/{id}:
 *   delete:
 *     summary: Delete a frequency cap
 *     tags: [FrequencyCaps]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200: { description: Frequency cap deleted successfully }
 */
router.delete(
  "/:id",
  auth,
  validate(frequencyCapIdParamSchema, "params"),
  deleteFrequencyCap
);

export default router;
