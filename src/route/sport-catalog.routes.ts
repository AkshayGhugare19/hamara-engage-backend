import { Router } from "express";
import {
  paginateSports,
  addSport,
  updateSport,
  deleteSport,
  paginateSportTeams,
  addSportTeam,
  updateSportTeam,
  deleteSportTeam,
  paginateSportTournaments,
  addSportTournament,
  updateSportTournament,
  deleteSportTournament,
  paginateSportMarkets,
  addSportMarket,
  updateSportMarket,
  deleteSportMarket,
} from "../modules/sport-catalog/controller/sport-catalog.controller";
import { auth } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import {
  paginateSportSimpleSchema,
  addSportSimpleSchema,
  updateSportSimpleSchema,
  paginateSportTeamSchema,
  addSportTeamSchema,
  updateSportTeamSchema,
  sportIdParamSchema,
} from "../validations/sport-catalog.validation";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: SportCatalog
 *   description: Sport catalog (sports, teams, tournaments, markets) APIs
 */

// ─── Sports ────────────────────────────────────────────────────────

/**
 * @swagger
 * /api/sport-catalog/sports/paginate:
 *   get:
 *     summary: Get paginated sports (search)
 *     tags: [SportCatalog]
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
 *     responses:
 *       200: { description: Paginated sports }
 */
router.get(
  "/sports/paginate",
  auth,
  validate(paginateSportSimpleSchema, "query"),
  paginateSports
);

router.post(
  "/sports/add",
  auth,
  validate(addSportSimpleSchema, "body"),
  addSport
);

router.post(
  "/sports/update-by/:id",
  auth,
  validate(sportIdParamSchema, "params"),
  validate(updateSportSimpleSchema, "body"),
  updateSport
);

router.delete(
  "/sports/:id",
  auth,
  validate(sportIdParamSchema, "params"),
  deleteSport
);

// ─── Teams ─────────────────────────────────────────────────────────

/**
 * @swagger
 * /api/sport-catalog/teams/paginate:
 *   get:
 *     summary: Get paginated teams (search + sport/tournament filters)
 *     tags: [SportCatalog]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Paginated teams }
 */
router.get(
  "/teams/paginate",
  auth,
  validate(paginateSportTeamSchema, "query"),
  paginateSportTeams
);

router.post(
  "/teams/add",
  auth,
  validate(addSportTeamSchema, "body"),
  addSportTeam
);

router.post(
  "/teams/update-by/:id",
  auth,
  validate(sportIdParamSchema, "params"),
  validate(updateSportTeamSchema, "body"),
  updateSportTeam
);

router.delete(
  "/teams/:id",
  auth,
  validate(sportIdParamSchema, "params"),
  deleteSportTeam
);

// ─── Tournaments ───────────────────────────────────────────────────

router.get(
  "/tournaments/paginate",
  auth,
  validate(paginateSportSimpleSchema, "query"),
  paginateSportTournaments
);

router.post(
  "/tournaments/add",
  auth,
  validate(addSportSimpleSchema, "body"),
  addSportTournament
);

router.post(
  "/tournaments/update-by/:id",
  auth,
  validate(sportIdParamSchema, "params"),
  validate(updateSportSimpleSchema, "body"),
  updateSportTournament
);

router.delete(
  "/tournaments/:id",
  auth,
  validate(sportIdParamSchema, "params"),
  deleteSportTournament
);

// ─── Markets ───────────────────────────────────────────────────────

router.get(
  "/markets/paginate",
  auth,
  validate(paginateSportSimpleSchema, "query"),
  paginateSportMarkets
);

router.post(
  "/markets/add",
  auth,
  validate(addSportSimpleSchema, "body"),
  addSportMarket
);

router.post(
  "/markets/update-by/:id",
  auth,
  validate(sportIdParamSchema, "params"),
  validate(updateSportSimpleSchema, "body"),
  updateSportMarket
);

router.delete(
  "/markets/:id",
  auth,
  validate(sportIdParamSchema, "params"),
  deleteSportMarket
);

export default router;
