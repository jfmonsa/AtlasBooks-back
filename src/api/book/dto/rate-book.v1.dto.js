import Joi from "joi";

const rateBookDTO = {
  idBook: Joi.number().required(),
  rate: Joi.number().required(),
};

export default rateBookDTO;
