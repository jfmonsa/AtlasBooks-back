import Joi from "joi";

const updateCommentV1DTO = {
  body: {
    text: Joi.string().required(),
    commentId: Joi.number().required(),
  },
};

export default updateCommentV1DTO;
