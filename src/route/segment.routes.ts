import { Router } from "express";
import {
  createSegment,
  paginateSegments,
  getSegment,
  getSegmentCreators,
  updateSegment,
  archiveSegment,
  restoreSegment,
  deleteSegment,
} from "../modules/segment/controller/segment.controller";
import { auth } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import {
  createSegmentSchema,
  updateSegmentSchema,
  segmentIdParamSchema,
} from "../validations/segment.validation";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Segments
 *   description: CRM Segment management APIs
 */

/**
 * @swagger
 * /api/segments/add:
 *   post:
 *     summary: Create a new segment
 *     tags: [Segments]
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
 *               name: { type: string, example: High Value Players }
 *               type: { type: string, enum: [DYNAMIC, STATIC], example: DYNAMIC }
 *               description: { type: string, example: Total Deposit over $300 Last 30 Days }
 *               tags: { type: array, items: { type: string } }
 *               content: { type: object }
 *               player_count: { type: integer, example: 0 }
 *     responses:
 *       200:
 *         description: Segment created successfully
 */
router.post("/add", auth, validate(createSegmentSchema), createSegment);

/**
 * @swagger
 * /api/segments/paginate:
 *   get:
 *     summary: Get paginated segments (supports search, type, created_by, tag, archived filters)
 *     tags: [Segments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - { in: query, name: page, schema: { type: integer, example: 1 } }
 *       - { in: query, name: limit, schema: { type: integer, example: 10 } }
 *       - { in: query, name: search, schema: { type: string } }
 *       - { in: query, name: type, schema: { type: string } }
 *       - { in: query, name: created_by, schema: { type: string } }
 *       - { in: query, name: tag, schema: { type: string } }
 *       - { in: query, name: archived, schema: { type: boolean } }
 *     responses:
 *       200:
 *         description: Paginated segments list
 */
router.get("/paginate", auth, paginateSegments);

/**
 * @swagger
 * /api/segments/creators:
 *   get:
 *     summary: Get the distinct list of segment creators
 *     tags: [Segments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Segment creators fetched successfully
 */
router.get("/creators", auth, getSegmentCreators);

/**
 * @swagger
 * /api/segments/{id}:
 *   get:
 *     summary: Get a single segment by ID
 *     tags: [Segments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200: { description: Segment fetched successfully }
 *       404: { description: Segment not found }
 */
router.get("/:id", auth, validate(segmentIdParamSchema, "params"), getSegment);

/**
 * @swagger
 * /api/segments/update-by/{id}:
 *   post:
 *     summary: Update segment by ID
 *     tags: [Segments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200: { description: Segment updated successfully }
 *       404: { description: Segment not found }
 */
router.post(
  "/update-by/:id",
  auth,
  validate(segmentIdParamSchema, "params"),
  validate(updateSegmentSchema, "body"),
  updateSegment
);

/**
 * @swagger
 * /api/segments/archive/{id}:
 *   post:
 *     summary: Archive a segment
 *     tags: [Segments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200: { description: Segment archived successfully }
 */
router.post(
  "/archive/:id",
  auth,
  validate(segmentIdParamSchema, "params"),
  archiveSegment
);

/**
 * @swagger
 * /api/segments/restore/{id}:
 *   post:
 *     summary: Restore an archived segment
 *     tags: [Segments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200: { description: Segment restored successfully }
 */
router.post(
  "/restore/:id",
  auth,
  validate(segmentIdParamSchema, "params"),
  restoreSegment
);

/**
 * @swagger
 * /api/segments/{id}:
 *   delete:
 *     summary: Delete segment by ID
 *     tags: [Segments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200: { description: Segment deleted successfully }
 *       404: { description: Segment not found }
 */
router.delete(
  "/:id",
  auth,
  validate(segmentIdParamSchema, "params"),
  deleteSegment
);

export default router;
