import { Router } from "express";
import {
  paginateMedia,
  addMedia,
  deleteMedia,
} from "../modules/media-database/controller/media-database.controller";
import { auth } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { uploadImageSafe } from "../middlewares/upload.middleware";
import {
  paginateMediaSchema,
  addMediaSchema,
  mediaIdParamSchema,
} from "../validations/media-database.validation";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: MediaDatabase
 *   description: Media database (image asset) management APIs
 */

/**
 * @swagger
 * /api/media-database/paginate:
 *   get:
 *     summary: Get paginated media assets (search + category filter)
 *     tags: [MediaDatabase]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, example: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, example: 25 }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [all, banners, booster-images, email-templates-assets, joy-saha, mission-bundles, mission-banner, template]
 *     responses:
 *       200:
 *         description: Paginated media list
 */
router.get(
  "/paginate",
  auth,
  validate(paginateMediaSchema, "query"),
  paginateMedia
);

/**
 * @swagger
 * /api/media-database/add:
 *   post:
 *     summary: Upload a new media asset
 *     tags: [MediaDatabase]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [name, category, image]
 *             properties:
 *               name: { type: string }
 *               description: { type: string }
 *               category:
 *                 type: string
 *                 enum: [banners, booster-images, email-templates-assets, joy-saha, mission-bundles, mission-banner, template]
 *               image: { type: string, format: binary }
 *     responses:
 *       201:
 *         description: File uploaded successfully
 */
router.post(
  "/add",
  auth,
  uploadImageSafe,
  validate(addMediaSchema, "body"),
  addMedia
);

/**
 * @swagger
 * /api/media-database/{id}:
 *   delete:
 *     summary: Delete a media asset by ID
 *     tags: [MediaDatabase]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Media deleted successfully
 *       404:
 *         description: Media not found
 */
router.delete(
  "/:id",
  auth,
  validate(mediaIdParamSchema, "params"),
  deleteMedia
);

export default router;
