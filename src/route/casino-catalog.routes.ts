import { Router } from "express";
import {
  paginateCasinoGames,
  addCasinoGame,
  updateCasinoGame,
  deleteCasinoGame,
  paginateCasinoCategories,
  addCasinoCategory,
  updateCasinoCategory,
  deleteCasinoCategory,
  paginateCasinoProviders,
  addCasinoProvider,
  updateCasinoProvider,
  deleteCasinoProvider,
} from "../modules/casino-catalog/controller/casino-catalog.controller";
import { auth } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import {
  paginateCasinoGameSchema,
  addCasinoGameSchema,
  updateCasinoGameSchema,
  paginateCasinoSimpleSchema,
  addCasinoSimpleSchema,
  updateCasinoSimpleSchema,
  casinoIdParamSchema,
} from "../validations/casino-catalog.validation";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: CasinoCatalog
 *   description: Casino catalog (games, categories, providers) APIs
 */

// ─── Games ─────────────────────────────────────────────────────────

/**
 * @swagger
 * /api/casino-catalog/games/paginate:
 *   get:
 *     summary: Get paginated casino games (search + provider/category filters)
 *     tags: [CasinoCatalog]
 *     security: [{ bearerAuth: [] }]
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
 *         name: provider
 *         schema: { type: string }
 *       - in: query
 *         name: category
 *         schema: { type: string }
 *     responses:
 *       200: { description: Paginated casino games }
 */
router.get(
  "/games/paginate",
  auth,
  validate(paginateCasinoGameSchema, "query"),
  paginateCasinoGames
);

/**
 * @swagger
 * /api/casino-catalog/games/add:
 *   post:
 *     summary: Create a new casino game
 *     tags: [CasinoCatalog]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       201: { description: Casino game created successfully }
 */
router.post(
  "/games/add",
  auth,
  validate(addCasinoGameSchema, "body"),
  addCasinoGame
);

/**
 * @swagger
 * /api/casino-catalog/games/update-by/{id}:
 *   post:
 *     summary: Update casino game by ID
 *     tags: [CasinoCatalog]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Casino game updated successfully }
 *       404: { description: Casino game not found }
 */
router.post(
  "/games/update-by/:id",
  auth,
  validate(casinoIdParamSchema, "params"),
  validate(updateCasinoGameSchema, "body"),
  updateCasinoGame
);

/**
 * @swagger
 * /api/casino-catalog/games/{id}:
 *   delete:
 *     summary: Delete casino game by ID
 *     tags: [CasinoCatalog]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Casino game deleted successfully }
 *       404: { description: Casino game not found }
 */
router.delete(
  "/games/:id",
  auth,
  validate(casinoIdParamSchema, "params"),
  deleteCasinoGame
);

// ─── Categories ────────────────────────────────────────────────────

router.get(
  "/categories/paginate",
  auth,
  validate(paginateCasinoSimpleSchema, "query"),
  paginateCasinoCategories
);

router.post(
  "/categories/add",
  auth,
  validate(addCasinoSimpleSchema, "body"),
  addCasinoCategory
);

router.post(
  "/categories/update-by/:id",
  auth,
  validate(casinoIdParamSchema, "params"),
  validate(updateCasinoSimpleSchema, "body"),
  updateCasinoCategory
);

router.delete(
  "/categories/:id",
  auth,
  validate(casinoIdParamSchema, "params"),
  deleteCasinoCategory
);

// ─── Providers ─────────────────────────────────────────────────────

router.get(
  "/providers/paginate",
  auth,
  validate(paginateCasinoSimpleSchema, "query"),
  paginateCasinoProviders
);

router.post(
  "/providers/add",
  auth,
  validate(addCasinoSimpleSchema, "body"),
  addCasinoProvider
);

router.post(
  "/providers/update-by/:id",
  auth,
  validate(casinoIdParamSchema, "params"),
  validate(updateCasinoSimpleSchema, "body"),
  updateCasinoProvider
);

router.delete(
  "/providers/:id",
  auth,
  validate(casinoIdParamSchema, "params"),
  deleteCasinoProvider
);

export default router;
