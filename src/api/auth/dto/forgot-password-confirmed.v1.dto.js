import Joi from "joi";

const changePasswordConfirmedV1DTO = {
  body: {
    newPassword: Joi.string().required().trim(),
    token: Joi.string().required().trim(),
  },
};

export default changePasswordConfirmedV1DTO;
