import Joi from "joi";

const deleteCommentV1Dto = {
  body: {
    commentId: Joi.string().required().trim(),
  },
};

export default deleteCommentV1Dto;
