import { Router } from "express";
import { auth } from "../middlewares/auth.middleware";
import { role } from "../middlewares/role.middleware";
import { validate } from "../middlewares/validate.middleware";

import {
  getAllSettings,
  getSettingsByPanel,
  getSetting,
  upsertSetting,
  bulkUpsertSettings,
  deleteSetting,
} from "../modules/system-settings/controller/system-setting.controller";
import {
  listAccountStatuses,
  getAccountStatus,
  createAccountStatus,
  updateAccountStatus,
  deleteAccountStatus,
  replaceAccountStatuses,
} from "../modules/system-settings/controller/account-status.controller";
import {
  listPaymentMethods,
  getPaymentMethod,
  createPaymentMethod,
  updatePaymentMethod,
  deletePaymentMethod,
  replacePaymentMethods,
} from "../modules/system-settings/controller/payment-method.controller";
import {
  listLanguages,
  getLanguage,
  createLanguage,
  updateLanguage,
  deleteLanguage,
  replaceLanguages,
} from "../modules/system-settings/controller/language.controller";
import {
  listOAuthClients,
  getOAuthClient,
  createOAuthClient,
  updateOAuthClient,
  deleteOAuthClient,
} from "../modules/system-settings/controller/oauth-client.controller";
import {
  listWebhooks,
  getWebhook,
  createWebhook,
  updateWebhook,
  deleteWebhook,
} from "../modules/system-settings/controller/webhook.controller";

import {
  idParamSchema,
  panelParamSchema,
  panelKeyParamSchema,
  upsertSettingSchema,
  bulkUpsertSettingsSchema,
  createAccountStatusSchema,
  updateAccountStatusSchema,
  bulkAccountStatusesSchema,
  createPaymentMethodSchema,
  updatePaymentMethodSchema,
  bulkPaymentMethodsSchema,
  createLanguageSchema,
  updateLanguageSchema,
  bulkLanguagesSchema,
  createOAuthClientSchema,
  updateOAuthClientSchema,
  createWebhookSchema,
  updateWebhookSchema,
} from "../validations/system-settings.validation";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: SystemSettings
 *   description: System settings APIs (key/value config + collections)
 */

// ─── KEY/VALUE SETTINGS ────────────────────────────────────────────────────────

/**
 * @swagger
 * /api/system-settings/settings:
 *   get:
 *     summary: Get all settings grouped by panel
 *     tags: [SystemSettings]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Settings grouped by panel }
 */
router.get("/settings", auth, getAllSettings);

/**
 * @swagger
 * /api/system-settings/settings/bulk:
 *   put:
 *     summary: Bulk upsert settings (Admin only)
 *     tags: [SystemSettings]
 *     security: [{ bearerAuth: [] }]
 */
router.put(
  "/settings/bulk",
  auth,
  role("ADMIN"),
  validate(bulkUpsertSettingsSchema),
  bulkUpsertSettings
);

/**
 * @swagger
 * /api/system-settings/settings/{panel}:
 *   get:
 *     summary: Get settings for one panel
 *     tags: [SystemSettings]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: panel
 *         required: true
 *         schema:
 *           type: string
 *           enum: [core, gamification, mission, crm, platform, widgets]
 */
router.get(
  "/settings/:panel",
  auth,
  validate(panelParamSchema, "params"),
  getSettingsByPanel
);

/**
 * @swagger
 * /api/system-settings/settings/{panel}/{key}:
 *   get:
 *     summary: Get a single setting
 *     tags: [SystemSettings]
 *     security: [{ bearerAuth: [] }]
 *   put:
 *     summary: Upsert a single setting (Admin only)
 *     tags: [SystemSettings]
 *     security: [{ bearerAuth: [] }]
 *   delete:
 *     summary: Delete a setting (Admin only)
 *     tags: [SystemSettings]
 *     security: [{ bearerAuth: [] }]
 */
router.get(
  "/settings/:panel/:key",
  auth,
  validate(panelKeyParamSchema, "params"),
  getSetting
);
router.put(
  "/settings/:panel/:key",
  auth,
  role("ADMIN"),
  validate(panelKeyParamSchema, "params"),
  validate(upsertSettingSchema, "body"),
  upsertSetting
);
router.delete(
  "/settings/:panel/:key",
  auth,
  role("ADMIN"),
  validate(panelKeyParamSchema, "params"),
  deleteSetting
);

// ─── ACCOUNT STATUSES ─────────────────────────────────────────────────────────
/**
 * @swagger
 * /api/system-settings/account-statuses:
 *   get: { tags: [SystemSettings], security: [{ bearerAuth: [] }], summary: List account statuses }
 *   post: { tags: [SystemSettings], security: [{ bearerAuth: [] }], summary: Create an account status (Admin) }
 */
router.get("/account-statuses", auth, listAccountStatuses);
router.put(
  "/account-statuses/bulk",
  auth,
  role("ADMIN"),
  validate(bulkAccountStatusesSchema),
  replaceAccountStatuses
);
router.post(
  "/account-statuses",
  auth,
  role("ADMIN"),
  validate(createAccountStatusSchema),
  createAccountStatus
);
router.get(
  "/account-statuses/:id",
  auth,
  validate(idParamSchema, "params"),
  getAccountStatus
);
router.put(
  "/account-statuses/:id",
  auth,
  role("ADMIN"),
  validate(idParamSchema, "params"),
  validate(updateAccountStatusSchema),
  updateAccountStatus
);
router.delete(
  "/account-statuses/:id",
  auth,
  role("ADMIN"),
  validate(idParamSchema, "params"),
  deleteAccountStatus
);

// ─── PAYMENT METHODS ──────────────────────────────────────────────────────────
router.get("/payment-methods", auth, listPaymentMethods);
router.put(
  "/payment-methods/bulk",
  auth,
  role("ADMIN"),
  validate(bulkPaymentMethodsSchema),
  replacePaymentMethods
);
router.post(
  "/payment-methods",
  auth,
  role("ADMIN"),
  validate(createPaymentMethodSchema),
  createPaymentMethod
);
router.get(
  "/payment-methods/:id",
  auth,
  validate(idParamSchema, "params"),
  getPaymentMethod
);
router.put(
  "/payment-methods/:id",
  auth,
  role("ADMIN"),
  validate(idParamSchema, "params"),
  validate(updatePaymentMethodSchema),
  updatePaymentMethod
);
router.delete(
  "/payment-methods/:id",
  auth,
  role("ADMIN"),
  validate(idParamSchema, "params"),
  deletePaymentMethod
);

// ─── LANGUAGES ────────────────────────────────────────────────────────────────
router.get("/languages", auth, listLanguages);
router.put(
  "/languages/bulk",
  auth,
  role("ADMIN"),
  validate(bulkLanguagesSchema),
  replaceLanguages
);
router.post(
  "/languages",
  auth,
  role("ADMIN"),
  validate(createLanguageSchema),
  createLanguage
);
router.get(
  "/languages/:id",
  auth,
  validate(idParamSchema, "params"),
  getLanguage
);
router.put(
  "/languages/:id",
  auth,
  role("ADMIN"),
  validate(idParamSchema, "params"),
  validate(updateLanguageSchema),
  updateLanguage
);
router.delete(
  "/languages/:id",
  auth,
  role("ADMIN"),
  validate(idParamSchema, "params"),
  deleteLanguage
);

// ─── OAUTH CLIENTS ────────────────────────────────────────────────────────────
router.get("/oauth-clients", auth, listOAuthClients);
router.post(
  "/oauth-clients",
  auth,
  role("ADMIN"),
  validate(createOAuthClientSchema),
  createOAuthClient
);
router.get(
  "/oauth-clients/:id",
  auth,
  validate(idParamSchema, "params"),
  getOAuthClient
);
router.put(
  "/oauth-clients/:id",
  auth,
  role("ADMIN"),
  validate(idParamSchema, "params"),
  validate(updateOAuthClientSchema),
  updateOAuthClient
);
router.delete(
  "/oauth-clients/:id",
  auth,
  role("ADMIN"),
  validate(idParamSchema, "params"),
  deleteOAuthClient
);

// ─── WEBHOOKS ─────────────────────────────────────────────────────────────────
router.get("/webhooks", auth, listWebhooks);
router.post(
  "/webhooks",
  auth,
  role("ADMIN"),
  validate(createWebhookSchema),
  createWebhook
);
router.get(
  "/webhooks/:id",
  auth,
  validate(idParamSchema, "params"),
  getWebhook
);
router.put(
  "/webhooks/:id",
  auth,
  role("ADMIN"),
  validate(idParamSchema, "params"),
  validate(updateWebhookSchema),
  updateWebhook
);
router.delete(
  "/webhooks/:id",
  auth,
  role("ADMIN"),
  validate(idParamSchema, "params"),
  deleteWebhook
);

export default router;
