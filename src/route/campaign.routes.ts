import { Router } from "express";
import {
  createCampaign,
  paginateCampaigns,
  getCampaign,
  updateCampaign,
  archiveCampaign,
  restoreCampaign,
  deleteCampaign,
} from "../modules/campaign/controller/campaign.controller";
import { auth } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import {
  createCampaignSchema,
  updateCampaignSchema,
  campaignIdParamSchema,
} from "../validations/campaign.validation";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Campaigns
 *   description: CRM Campaign management APIs
 */

/**
 * @swagger
 * /api/campaigns/add:
 *   post:
 *     summary: Create a new campaign
 *     tags: [Campaigns]
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
 *               name: { type: string, example: Welcome Journey }
 *               type: { type: string, example: Direct Campaign }
 *               description: { type: string }
 *               tags: { type: array, items: { type: string } }
 *               trigger: { type: string, example: "Scheduled - Now" }
 *               segment: { type: string, example: "Level -1" }
 *               start_date: { type: string, format: date-time }
 *               end_date: { type: string, format: date-time }
 *     responses:
 *       200:
 *         description: Campaign created successfully
 */
router.post("/add", auth, validate(createCampaignSchema), createCampaign);

/**
 * @swagger
 * /api/campaigns/paginate:
 *   get:
 *     summary: Get paginated campaigns (supports search, status, trigger, tag, archived filters)
 *     tags: [Campaigns]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - { in: query, name: page, schema: { type: integer, example: 1 } }
 *       - { in: query, name: limit, schema: { type: integer, example: 10 } }
 *       - { in: query, name: search, schema: { type: string } }
 *       - { in: query, name: status, schema: { type: string } }
 *       - { in: query, name: trigger, schema: { type: string } }
 *       - { in: query, name: tag, schema: { type: string } }
 *       - { in: query, name: archived, schema: { type: boolean } }
 *     responses:
 *       200:
 *         description: Paginated campaigns list
 */
router.get("/paginate", auth, paginateCampaigns);

/**
 * @swagger
 * /api/campaigns/{id}:
 *   get:
 *     summary: Get a single campaign by ID
 *     tags: [Campaigns]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200: { description: Campaign fetched successfully }
 *       404: { description: Campaign not found }
 */
router.get(
  "/:id",
  auth,
  validate(campaignIdParamSchema, "params"),
  getCampaign
);

/**
 * @swagger
 * /api/campaigns/update-by/{id}:
 *   post:
 *     summary: Update campaign by ID
 *     tags: [Campaigns]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200: { description: Campaign updated successfully }
 *       404: { description: Campaign not found }
 */
router.post(
  "/update-by/:id",
  auth,
  validate(campaignIdParamSchema, "params"),
  validate(updateCampaignSchema, "body"),
  updateCampaign
);

/**
 * @swagger
 * /api/campaigns/archive/{id}:
 *   post:
 *     summary: Archive a campaign
 *     tags: [Campaigns]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200: { description: Campaign archived successfully }
 */
router.post(
  "/archive/:id",
  auth,
  validate(campaignIdParamSchema, "params"),
  archiveCampaign
);

/**
 * @swagger
 * /api/campaigns/restore/{id}:
 *   post:
 *     summary: Restore an archived campaign
 *     tags: [Campaigns]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200: { description: Campaign restored successfully }
 */
router.post(
  "/restore/:id",
  auth,
  validate(campaignIdParamSchema, "params"),
  restoreCampaign
);

/**
 * @swagger
 * /api/campaigns/{id}:
 *   delete:
 *     summary: Delete campaign by ID
 *     tags: [Campaigns]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200: { description: Campaign deleted successfully }
 *       404: { description: Campaign not found }
 */
router.delete(
  "/:id",
  auth,
  validate(campaignIdParamSchema, "params"),
  deleteCampaign
);

export default router;
