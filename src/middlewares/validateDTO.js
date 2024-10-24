import { ValidationError } from "../helpers/exeptions.js";
import { Joi } from "../helpers/validations.js";

/**
 * @function validateDTO
 * Hof that returns a middleware to validate DTOs defined  with Joi
 */

export default function validateDTO(dto) {
  return (req, _res, next) => {
    const schema = Joi.object(dto);
    const { error, value } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      throw new ValidationError(error);
    }

    // replace request body with validated value
    // because we are sanitizing the request body
    req.body = value;
    next();
  };
}
