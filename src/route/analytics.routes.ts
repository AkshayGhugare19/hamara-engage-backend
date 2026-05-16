import { Router } from "express";
import {
  getCampaignAnalytics,
  getCampaignAnalyticsDetail,
  getHistory,
  trackEvent,
} from "../modules/analytics/controller/analytics.controller";
import { auth } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import {
  trackEventSchema,
  analyticsIdParamSchema,
} from "../validations/analytics.validation";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Analytics
 *   description: CRM Campaign analytics & delivery history APIs
 */

/**
 * @swagger
 * /api/analytics/campaigns:
 *   get:
 *     summary: Paginated per-campaign analytics (Email & SMS channel metrics)
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - { in: query, name: page, schema: { type: integer, example: 1 } }
 *       - { in: query, name: limit, schema: { type: integer, example: 10 } }
 *       - { in: query, name: search, schema: { type: string } }
 *       - { in: query, name: status, schema: { type: string } }
 *       - { in: query, name: tag, schema: { type: string } }
 *       - { in: query, name: period, schema: { type: string, enum: [today, 7d, 30d, lifetime] } }
 *     responses:
 *       200: { description: Campaign analytics list }
 */
router.get("/campaigns", auth, getCampaignAnalytics);

/**
 * @swagger
 * /api/analytics/campaigns/{id}:
 *   get:
 *     summary: Analytics detail for a single campaign (channel breakdown + recent events)
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200: { description: Campaign analytics detail }
 *       404: { description: Campaign not found }
 */
router.get(
  "/campaigns/:id",
  auth,
  validate(analyticsIdParamSchema, "params"),
  getCampaignAnalyticsDetail
);

/**
 * @swagger
 * /api/analytics/history:
 *   get:
 *     summary: Paginated per-player delivery/engagement history
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - { in: query, name: page, schema: { type: integer, example: 1 } }
 *       - { in: query, name: limit, schema: { type: integer, example: 10 } }
 *       - { in: query, name: search, schema: { type: string } }
 *       - { in: query, name: status, schema: { type: string } }
 *       - { in: query, name: channel, schema: { type: string } }
 *       - { in: query, name: period, schema: { type: string, enum: [today, 7d, 30d, lifetime] } }
 *     responses:
 *       200: { description: Campaign history list }
 */
router.get("/history", auth, getHistory);

/**
 * @swagger
 * /api/analytics/track:
 *   post:
 *     summary: Record a delivery/engagement event (drives history + aggregate metrics)
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [player_id, status, channel]
 *             properties:
 *               campaign_id: { type: string, format: uuid }
 *               name: { type: string }
 *               player_id: { type: string }
 *               status: { type: string, enum: [SENT, DELIVERED, OPEN, CLICK, LOGIN, BOUNCED, FAILED] }
 *               channel: { type: string, enum: [EMAIL, SMS, WEB_PUSH, ONSITE] }
 *               sms_parts: { type: integer }
 *     responses:
 *       200: { description: Event tracked successfully }
 */
router.post("/track", auth, validate(trackEventSchema), trackEvent);

export default router;
