import { Router } from "express";
import {
  createUnsubscribeReport,
  paginateUnsubscribeReports,
} from "../modules/unsubscribe-report/controller/unsubscribe-report.controller";
import { auth } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { createUnsubscribeReportSchema } from "../validations/unsubscribe-report.validation";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: UnsubscribeReports
 *   description: CRM Unsubscribe report APIs
 */

/**
 * @swagger
 * /api/unsubscribe-reports/add:
 *   post:
 *     summary: Record a player unsubscribe event
 *     tags: [UnsubscribeReports]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [player_id, channel]
 *             properties:
 *               player_id: { type: string }
 *               campaign_name: { type: string }
 *               channel: { type: string, enum: [EMAIL, SMS, ONSITE, WEBPUSH, INAPP] }
 *               reason: { type: string }
 *     responses:
 *       200: { description: Unsubscribe record created successfully }
 */
router.post(
  "/add",
  auth,
  validate(createUnsubscribeReportSchema),
  createUnsubscribeReport
);

/**
 * @swagger
 * /api/unsubscribe-reports/paginate:
 *   get:
 *     summary: Get paginated unsubscribe reports
 *     tags: [UnsubscribeReports]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: query, name: page, schema: { type: integer } }
 *       - { in: query, name: limit, schema: { type: integer } }
 *       - { in: query, name: campaign_name, schema: { type: string } }
 *       - { in: query, name: player_id, schema: { type: string } }
 *       - { in: query, name: channel, schema: { type: string } }
 *       - { in: query, name: days, schema: { type: integer }, description: "Lookback window in days; omit for Lifetime" }
 *     responses:
 *       200: { description: Paginated unsubscribe reports }
 */
router.get("/paginate", auth, paginateUnsubscribeReports);

export default router;
