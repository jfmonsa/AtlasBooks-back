import { ValidationError } from "../helpers/exeptions.js";
import { Joi } from "../helpers/validations.js";

/**
 * @function validateDTO
 * Hof that returns a middleware to validate DTOs defined  with Joi
 */
export default function validateDTO(dto) {
  return (req, _res, next) => {
    const schema = createSchema(dto);

    const requestData = {
      body: req.body,
      query: req.query,
      params: req.params,
    };
    const { error, value } = schema.validate(requestData, {
      abortEarly: false,
    });

    if (error) {
      throw new ValidationError(error);
    }

    // replace request original data with validated data
    // because we are sanitizing the request body
    req.body = value.body || req.body;
    req.query = value.query || req.query;
    req.params = value.params || req.params;

    next();
  };
}

/**
 * Create a Joi schema with the provided DTO
 * @param {*} dto @see docs/architecture.md
 * @returns Joi schema
 */
function createSchema(dto) {
  const knownParams = ["version"]; // Lista de parámetros conocidos a ignorar

  return Joi.object(
    Object.keys(dto).reduce((acc, key) => {
      if (["body", "query", "params"].includes(key)) {
        acc[key] = Joi.object(
          Object.keys(dto[key]).reduce((innerAcc, innerKey) => {
            if (!knownParams.includes(innerKey)) {
              innerAcc[innerKey] = dto[key][innerKey];
            }
            return innerAcc;
          }, {})
        ).unknown(true); // Allow additional params at the root level
      }
      return acc;
    }, {})
  ).unknown(true); // Allow additional params at the root level
}
