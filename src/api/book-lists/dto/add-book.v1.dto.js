import Joi from "joi";

const addBookV1Dto = {
  body: {
    bookId: Joi.string().required().trim(),
    listId: Joi.string().required().trim(),
  },
};

export default addBookV1Dto;
