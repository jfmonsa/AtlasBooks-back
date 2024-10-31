import Joi from "joi";

const rateBookDTO = {
  body: {
    idBook: Joi.string().required().trim(),
    rate: Joi.number().min(1).max(5).required(),
  },
};

export default rateBookDTO;
