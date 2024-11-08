import Joi from "joi";

const searchBooksV1Dto = {
  query: {
    search: Joi.string().trim(),
    language: Joi.string().trim(),
    yearFrom: Joi.number().integer(),
    yearTo: Joi.number().integer(),
    category: Joi.number().integer(),
    subCategory: Joi.number().integer(),
  },
};

export default searchBooksV1Dto;
