import Joi from "joi";

const loginDTO = {
  body: {
    userNicknameOrEmail: Joi.string().required().trim(),
    userPassword: Joi.string().required().trim(),
  },
};

export default loginDTO;
