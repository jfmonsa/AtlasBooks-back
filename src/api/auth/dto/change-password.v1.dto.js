import Joi from "joi";

const changePasswordV1DTO = {
  body: {
    currentPassword: Joi.string().required().trim(),
    newPassword: Joi.string().required().trim(),
  },
};

export default changePasswordV1DTO;
