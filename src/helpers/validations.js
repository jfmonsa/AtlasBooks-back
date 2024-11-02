/** @file @module Global variables and utils for shared field validtions */

import countryStateValidator from "joi-country-state";
import BaseJoi from "joi";

/**
 * @constant {Object} Joi - Extended Joi instance with support for country codes
 * use it  when need to validate countries
 */
export const Joi = BaseJoi.extend(countryStateValidator);

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
