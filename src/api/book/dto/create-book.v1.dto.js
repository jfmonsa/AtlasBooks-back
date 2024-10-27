import Joi from "joi";

const createBookDTO = {
  title: Joi.string().required(),
  description: Joi.string(),
  isbn: Joi.string().required(),
  publisher: Joi.string(),
  volume: Joi.number(),
  yearReleased: Joi.number().required(),
  authors: Joi.array().items(Joi.string()).required(),
  languages: Joi.array().items(Joi.string()).required(),
  subcategoryIds: Joi.array().items(Joi.number()).required(),
};

export default createBookDTO;
