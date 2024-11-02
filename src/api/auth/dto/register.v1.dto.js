import { Joi, passwordField } from "../../../helpers/validations.js";

const registerDTO = {
  body: {
    fullName: Joi.string().min(4).max(20).required().trim(),
    nickname: Joi.string().min(4).max(20).required().trim(),
    email: Joi.string().email().required().trim(),
    password: passwordField,
    country: Joi.string().country().required().trim(),
  },
};

export default registerDTO;
