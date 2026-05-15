import { Router } from "express";
import {
  paginateGamificationTags,
  addGamificationTag,
  updateGamificationTag,
  deleteGamificationTag,
} from "../modules/gamification-tag/controller/gamification-tag.controller";
import { auth } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import {
  paginateGamificationTagSchema,
  addGamificationTagSchema,
  updateGamificationTagSchema,
  gamificationTagIdParamSchema,
} from "../validations/gamification-tag.validation";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: GamificationTags
 *   description: Gamification tag management APIs
 */

/**
 * @swagger
 * /api/tags-gamification/paginate:
 *   get:
 *     summary: Get paginated gamification tags (with search + category filter)
 *     tags: [GamificationTags]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, example: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, example: 10 }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [mission, ranks, reward-shop, token-rules, tournaments, xp-points]
 *     responses:
 *       200:
 *         description: Paginated gamification tags
 */
router.get(
  "/paginate",
  auth,
  validate(paginateGamificationTagSchema, "query"),
  paginateGamificationTags
);

/**
 * @swagger
 * /api/tags-gamification/add:
 *   post:
 *     summary: Create a new gamification tag
 *     tags: [GamificationTags]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, category]
 *             properties:
 *               name: { type: string, example: Daily Login }
 *               description: { type: string, example: Tag for daily login missions }
 *               category:
 *                 type: string
 *                 enum: [mission, ranks, reward-shop, token-rules, tournaments, xp-points]
 *     responses:
 *       201:
 *         description: Gamification tag created successfully
 */
router.post(
  "/add",
  auth,
  validate(addGamificationTagSchema, "body"),
  addGamificationTag
);

/**
 * @swagger
 * /api/tags-gamification/update-by/{id}:
 *   post:
 *     summary: Update gamification tag by ID
 *     tags: [GamificationTags]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Gamification tag updated successfully
 *       404:
 *         description: Gamification tag not found
 */
router.post(
  "/update-by/:id",
  auth,
  validate(gamificationTagIdParamSchema, "params"),
  validate(updateGamificationTagSchema, "body"),
  updateGamificationTag
);

/**
 * @swagger
 * /api/tags-gamification/{id}:
 *   delete:
 *     summary: Delete gamification tag by ID
 *     tags: [GamificationTags]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Gamification tag deleted successfully
 *       404:
 *         description: Gamification tag not found
 */
router.delete(
  "/:id",
  auth,
  validate(gamificationTagIdParamSchema, "params"),
  deleteGamificationTag
);

export default router;
