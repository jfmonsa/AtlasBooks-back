import Joi from "joi";

const forgotPasswordV1DTO = {
  body: {
    email: Joi.string().email().required(),
  },
};

export default forgotPasswordV1DTO;
