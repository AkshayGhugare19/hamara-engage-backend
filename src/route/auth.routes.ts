import { Router } from "express";
import { register, login, resetPassword } from "../modules/auth/controller/auth.controller";
import { validate } from "../middlewares/validate.middleware";
import { registerSchema, loginSchema, resetPasswordSchema } from "../validations/auth.validation";

const router = Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [first_name, last_name, email, password, mobile]
 *             properties:
 *               first_name:
 *                 type: string
 *                 example: John
 *               last_name:
 *                 type: string
 *                 example: Doe
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 example: secret123
 *               mobile:
 *                 type: string
 *                 example: "9876543210"
 *     responses:
 *       201:
 *         description: User registered successfully
 *       409:
 *         description: Email already exists
 *       422:
 *         description: Validation failed
 */
router.post("/register", validate(registerSchema), register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             email: admin@test.com
 *             password: test@123
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             example:
 *               token: jwt_token_here
 *       401:
 *         description: Invalid credentials
 *       422:
 *         description: Validation failed
 */
router.post("/login", validate(loginSchema), login);

/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     summary: Reset password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - new_password
 *             properties:
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               token:
 *                 type: string
 *                 example: your-reset-token
 *                 nullable: true
 *                 description: Optional reset token
 *               new_password:
 *                 type: string
 *                 example: sample@123
 *     responses:
 *       200:
 *         description: Password reset successful
 *       400:
 *         description: Invalid token or email
 *       422:
 *         description: Validation failed
 */
router.post("/reset-password", validate(resetPasswordSchema), resetPassword);

export default router;
