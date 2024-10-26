import Joi from "joi";

const loginDTO = {
  userNicknameOrEmail: Joi.string().required(),
  userPassword: Joi.string().required(),
};

export default loginDTO;
