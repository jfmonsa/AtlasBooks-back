import Joi from "joi";

const searchBooksV1Dto = {
  query: {
    search: Joi.string().trim(),
    language: Joi.string().trim(),
    yearFrom: Joi.number().integer(),
    yearTo: Joi.number().integer(),
    categoryId: Joi.string().trim(),
    subCategoryId: Joi.string().trim(),
  },
};

export default searchBooksV1Dto;
