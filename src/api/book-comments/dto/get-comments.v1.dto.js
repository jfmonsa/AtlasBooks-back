import Joi from "joi";

const getCommentsV1DTO = {
  params: {
    bookId: Joi.string().required(),
  },
};

export default getCommentsV1DTO;
