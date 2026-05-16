import { Router } from "express";
import {
  createTemplate,
  paginateTemplates,
  getTemplate,
  updateTemplate,
  archiveTemplate,
  restoreTemplate,
  deleteTemplate,
} from "../modules/template/controller/template.controller";
import { auth } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import {
  createTemplateSchema,
  updateTemplateSchema,
  templateIdParamSchema,
} from "../validations/template.validation";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Templates
 *   description: CRM Template management APIs (Email, SMS, On-site, Web Push, In-App)
 */

/**
 * @swagger
 * /api/templates/add:
 *   post:
 *     summary: Create a new template
 *     tags: [Templates]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, channel]
 *             properties:
 *               name: { type: string, example: Welcome Bonus Email }
 *               channel: { type: string, enum: [EMAIL, SMS, ONSITE, WEBPUSH, INAPP] }
 *               description: { type: string }
 *               language: { type: string, example: English }
 *               tags: { type: array, items: { type: string } }
 *               subject: { type: string }
 *               content: { type: string }
 *               test_recipients: { type: array, items: { type: string } }
 *     responses:
 *       200:
 *         description: Template created successfully
 */
router.post("/add", auth, validate(createTemplateSchema), createTemplate);

/**
 * @swagger
 * /api/templates/paginate:
 *   get:
 *     summary: Get paginated templates (supports search, channel, language, tag, archived filters)
 *     tags: [Templates]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - { in: query, name: page, schema: { type: integer, example: 1 } }
 *       - { in: query, name: limit, schema: { type: integer, example: 10 } }
 *       - { in: query, name: search, schema: { type: string } }
 *       - { in: query, name: channel, schema: { type: string } }
 *       - { in: query, name: language, schema: { type: string } }
 *       - { in: query, name: tag, schema: { type: string } }
 *       - { in: query, name: archived, schema: { type: boolean } }
 *     responses:
 *       200:
 *         description: Paginated templates list
 */
router.get("/paginate", auth, paginateTemplates);

/**
 * @swagger
 * /api/templates/{id}:
 *   get:
 *     summary: Get a single template by ID
 *     tags: [Templates]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200: { description: Template fetched successfully }
 *       404: { description: Template not found }
 */
router.get(
  "/:id",
  auth,
  validate(templateIdParamSchema, "params"),
  getTemplate
);

/**
 * @swagger
 * /api/templates/update-by/{id}:
 *   post:
 *     summary: Update template by ID
 *     tags: [Templates]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200: { description: Template updated successfully }
 *       404: { description: Template not found }
 */
router.post(
  "/update-by/:id",
  auth,
  validate(templateIdParamSchema, "params"),
  validate(updateTemplateSchema, "body"),
  updateTemplate
);

/**
 * @swagger
 * /api/templates/archive/{id}:
 *   post:
 *     summary: Archive a template
 *     tags: [Templates]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200: { description: Template archived successfully }
 */
router.post(
  "/archive/:id",
  auth,
  validate(templateIdParamSchema, "params"),
  archiveTemplate
);

/**
 * @swagger
 * /api/templates/restore/{id}:
 *   post:
 *     summary: Restore an archived template
 *     tags: [Templates]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200: { description: Template restored successfully }
 */
router.post(
  "/restore/:id",
  auth,
  validate(templateIdParamSchema, "params"),
  restoreTemplate
);

/**
 * @swagger
 * /api/templates/{id}:
 *   delete:
 *     summary: Delete template by ID
 *     tags: [Templates]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200: { description: Template deleted successfully }
 *       404: { description: Template not found }
 */
router.delete(
  "/:id",
  auth,
  validate(templateIdParamSchema, "params"),
  deleteTemplate
);

export default router;
