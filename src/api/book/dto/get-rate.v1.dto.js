import Joi from "joi";

const getRateV1DTO = {
  params: {
    userId: Joi.string().required().trim(),
    idBook: Joi.string().required().trim(),
  },
};

export default getRateV1DTO;
