import { Router } from "express";
import {
  paginatePlayers,
  getPlayer,
  createPlayer,
  updatePlayer,
  deletePlayer,
  getCampaignHistory,
  getRewards,
  addManualReward,
  getLogs,
  getPlayerByEmail,
  addPlayerXpByEmail,
} from "../modules/player/controller/player.controller";
import { auth } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import {
  createPlayerSchema,
  updatePlayerSchema,
  playerIdParamSchema,
  manualRewardSchema,
  addXpByEmailSchema,
} from "../validations/player.validation";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Players
 *   description: End-customer (player) profiles, history, rewards & logs
 */

/**
 * @swagger
 * /api/players/paginate:
 *   get:
 *     summary: Get paginated players (search by player_id/username/name/email; filter by status/country)
 *     tags: [Players]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: query, name: page, schema: { type: integer, example: 1 } }
 *       - { in: query, name: limit, schema: { type: integer, example: 25 } }
 *       - { in: query, name: search, schema: { type: string } }
 *       - { in: query, name: status, schema: { type: string } }
 *       - { in: query, name: country, schema: { type: string } }
 *     responses:
 *       200: { description: Paginated players list }
 */
router.get("/paginate", auth, paginatePlayers);

/**
 * @swagger
 * /api/players/add:
 *   post:
 *     summary: Create a new player
 *     tags: [Players]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Player created successfully }
 */
router.post("/add", auth, validate(createPlayerSchema), createPlayer);

/**
 * @swagger
 * /api/players/{id}:
 *   get:
 *     summary: Get a single player profile by ID
 *     tags: [Players]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200: { description: Player fetched successfully }
 *       404: { description: Player not found }
 */
router.get("/:id", validate(playerIdParamSchema, "params"), getPlayer);

/**
 * @swagger
 * /api/players/by-email:
 *   post:
 *     summary: Get player profile by email
 *     tags: [Players]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Player fetched successfully
 *       404:
 *         description: Player not found
 */
router.post("/by-email", getPlayerByEmail );

/**
 * @swagger
 * /api/players/by-email/add-xp:
 *   post:
 *     summary: Add XP to a player (by email) and recompute level & rank
 *     description: >
 *       Accumulates the XP delta on the player resolved by email, then
 *       recomputes level, rank and xp_to_next from the configured CRM rank
 *       ladder and auto-grants any per-level rewards crossed. Uses the same
 *       gamification engine as the service sync path.
 *     tags: [Players]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, amount]
 *             properties:
 *               email:  { type: string, format: email }
 *               amount: { type: number, example: 150, description: XP delta (non-zero; may be negative) }
 *     responses:
 *       200: { description: Player XP updated successfully }
 *       400: { description: Invalid amount }
 *       404: { description: Player not found }
 */
router.post(
  "/by-email/add-xp",
  validate(addXpByEmailSchema, "body"),
  addPlayerXpByEmail
);

/**
 * @swagger
 * /api/players/update-by/{id}:
 *   post:
 *     summary: Update player by ID
 *     tags: [Players]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200: { description: Player updated successfully }
 */
router.post(
  "/update-by/:id",
  auth,
  validate(playerIdParamSchema, "params"),
  validate(updatePlayerSchema, "body"),
  updatePlayer
);

/**
 * @swagger
 * /api/players/{id}:
 *   delete:
 *     summary: Delete player by ID
 *     tags: [Players]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200: { description: Player deleted successfully }
 */
router.delete(
  "/:id",
  auth,
  validate(playerIdParamSchema, "params"),
  deletePlayer
);

/**
 * @swagger
 * /api/players/{id}/campaign-history:
 *   get:
 *     summary: Paginated campaign delivery history for a player
 *     tags: [Players]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string, format: uuid } }
 *       - { in: query, name: page, schema: { type: integer } }
 *       - { in: query, name: limit, schema: { type: integer } }
 *       - { in: query, name: search, schema: { type: string } }
 *     responses:
 *       200: { description: Campaign history fetched }
 */
router.get(
  "/:id/campaign-history",
  auth,
  validate(playerIdParamSchema, "params"),
  getCampaignHistory
);

/**
 * @swagger
 * /api/players/{id}/rewards:
 *   get:
 *     summary: Paginated gamification rewards for a player
 *     tags: [Players]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200: { description: Rewards fetched }
 *   post:
 *     summary: Add a manual reward to a player
 *     tags: [Players]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200: { description: Manual reward added }
 */
router.get(
  "/:id/rewards",
  auth,
  validate(playerIdParamSchema, "params"),
  getRewards
);
router.post(
  "/:id/rewards",
  auth,
  validate(playerIdParamSchema, "params"),
  validate(manualRewardSchema, "body"),
  addManualReward
);

/**
 * @swagger
 * /api/players/{id}/logs:
 *   get:
 *     summary: Paginated account activity logs for a player
 *     tags: [Players]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200: { description: Logs fetched }
 */
router.get("/:id/logs", auth, validate(playerIdParamSchema, "params"), getLogs);

export default router;
