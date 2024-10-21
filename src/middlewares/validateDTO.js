import { ValidationError } from "../helpers/exeptions.js";

/**
 * @function validateDTO
 * Hof that returns a middleware to validate DTOs defined  with Joi
 */

export default function validateDTO(schema) {
  return async (req, _res, next) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      throw new ValidationError(error);
    }

    // replace request body with validated value
    // because then we have applied defaults
    req.body = value;
    next();
  };
}
