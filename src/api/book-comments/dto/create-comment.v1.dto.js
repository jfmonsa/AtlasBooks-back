import Joi from "joi";

const createCommentV1DTO = {
  body: {
    bookId: Joi.number().required(),
    text: Joi.string().required(),
  },
};

export default createCommentV1DTO;
