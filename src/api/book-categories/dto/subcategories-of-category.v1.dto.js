import Joi from "joi";

const subcategoriesOfCategoryV1DTO = {
  params: {
    categoryId: Joi.string().required().trim(),
  },
};

export default subcategoriesOfCategoryV1DTO;
