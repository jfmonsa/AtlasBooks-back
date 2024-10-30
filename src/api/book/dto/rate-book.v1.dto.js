import Joi from "joi";

const rateBookDTO = {
  body: {
    idBook: Joi.number().required(),
    rate: Joi.number().required(),
  },
};

export default rateBookDTO;
