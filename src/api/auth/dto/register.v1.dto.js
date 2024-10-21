import { Joi, passwordField } from "../../../helpers/validations.js";

const registerDTO = Joi.object({
  name: Joi.string().min(4).max(20).required().trim(),
  email: Joi.string().email().required().trim(),
  password: passwordField,
  nickname: Joi.string().min(4).max(20).required().trim(),
  country: Joi.string().country().required().trim(),
});

export default registerDTO;
