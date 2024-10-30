import Joi from "joi";

const deleteCommentV1Dto = {
  body: {
    commentId: Joi.string().required(),
  },
};

export default deleteCommentV1Dto;
