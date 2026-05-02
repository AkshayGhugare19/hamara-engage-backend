import { Request, Response, NextFunction } from "express";
import Joi from "joi";

type ValidationTarget = "body" | "query" | "params";

/**
 * Reusable Joi validation middleware factory.
 *
 * Usage:
 *   router.post("/register", validate(registerSchema), register);
 *   router.get("/paginate", validate(paginateSchema, "query"), paginateUsers);
 */
export const validate =
  (schema: Joi.ObjectSchema, target: ValidationTarget = "body") =>
  (req: Request, res: Response, next: NextFunction): void => {
    const { error, value } = schema.validate(req[target], {
      abortEarly: false,   // return ALL errors at once
      stripUnknown: true,  // remove unknown fields
    });

    if (error) {
      const errors = error.details.map((d) => d.message);
      res.status(422).json({
        success: false,
        message: "Validation failed",
        errors,
      });
      return;
    }

    // Replace req[target] with the validated + sanitized value
    req[target] = value;
    next();
  };
