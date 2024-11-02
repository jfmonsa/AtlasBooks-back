import Joi from "joi";

const createBookDTO = {
  body: {
    title: Joi.string().required().trim(),
    description: Joi.string().trim(),
    isbn: Joi.string().required().trim(),
    publisher: Joi.string().trim(),
    volume: Joi.number(),
    yearReleased: Joi.number().required(),
    authors: Joi.array().items(Joi.string().trim()).required(),
    languages: Joi.array().items(Joi.string().trim()).required(),
    subcategoryIds: Joi.array().items(Joi.string().trim()).required(),
  },
};

export default createBookDTO;
