import Joi from "joi";

const createCommentV1DTO = {
  body: {
    bookId: Joi.string().required().trim(),
    text: Joi.string().required().trim(),
  },
};

export default createCommentV1DTO;
