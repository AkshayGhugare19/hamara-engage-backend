import { Router } from "express";
import { receiveEvent } from "../modules/integration/controller/integration.controller";
import { serviceAuth } from "../middlewares/serviceAuth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { syncEventSchema } from "../validations/integration.validation";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Integration
 *   description: Service-to-service gamification sync (gamify-engage → gamru)
 */

/**
 * @swagger
 * /api/integration/events:
 *   post:
 *     summary: Apply a gamification sync event to the linked player
 *     description: >
 *       Service-authenticated (x-service-key). Idempotent on event_id.
 *       USER_REGISTERED links the gamify user to a gamru player;
 *       XP_AWARDED accumulates XP and recomputes level/rank from the
 *       configured rank ladder.
 *     tags: [Integration]
 *     responses:
 *       200: { description: Event processed }
 *       401: { description: Unauthorized service }
 */
router.post(
  "/events",
  serviceAuth,
  validate(syncEventSchema, "body"),
  receiveEvent
);

export default router;
