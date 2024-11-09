import Joi from "joi";

const getRateV1DTO = {
  params: {
    userNickname: Joi.string().required().trim(),
    idBook: Joi.string().required().trim(),
  },
};

export default getRateV1DTO;
