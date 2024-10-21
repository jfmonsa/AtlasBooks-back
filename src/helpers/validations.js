import { ValidationError } from "./exeptions.js";
/** @file @module Global variables and utils for shared field validtions */

/** Joi extended instance with support for country codes, only use it when needed */
import BaseJoi from "joi";
import countryStateValidator from "joi-country-state";
export const Joi = BaseJoi.extend(countryStateValidator);

/** generic function to validate joi schemas */
export const validate = (schema, data) => {
  const { error, value } = schema.validate(data, { abortEarly: false });
  if (error) {
    throw new ValidationError(error);
  }
  return value;
};

/** password field */
const ONE_DIGIT = "(?=.*[0-9])";
const LOWER_CASE = "(?=.*[a-z])";
const UPPER_CASE = "(?=.*[A-Z])";
const SPECIAL_CHAR = "(?=.*[@#$%^&+=])";
const PATTERN = ONE_DIGIT + LOWER_CASE + UPPER_CASE + SPECIAL_CHAR;

export const passwordField = Joi.string()
  .min(8)
  .max(20)
  .regex(new RegExp(PATTERN))
  .required()
  .trim();
