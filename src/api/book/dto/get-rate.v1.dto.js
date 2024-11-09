import Joi from "joi";

const getRateV1DTO = {
  query: {
    userId: Joi.string().trim(),
    idBook: Joi.string().required().trim(),
  },
};

export default getRateV1DTO;
