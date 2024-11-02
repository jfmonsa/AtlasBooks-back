import Joi from "joi";

const changeEmailV1DTO = {
  body: {
    currentEmail: Joi.string().email().required(),
    newEmail: Joi.string().email().required(),
  },
};

export default changeEmailV1DTO;
