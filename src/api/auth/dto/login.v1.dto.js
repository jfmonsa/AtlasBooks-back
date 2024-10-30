import Joi from "joi";

const loginDTO = {
  body: {
    userNicknameOrEmail: Joi.string().required(),
    userPassword: Joi.string().required(),
  },
};

export default loginDTO;
