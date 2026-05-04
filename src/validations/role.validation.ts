import Joi from "joi";

export const addRoleSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().optional(),
});

export const updateRoleSchema = Joi.object({
  name: Joi.string().optional(),
  description: Joi.string().optional(),
  status: Joi.string().valid("ACTIVE", "INACTIVE").optional(),
});