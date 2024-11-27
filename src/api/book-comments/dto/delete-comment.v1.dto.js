import Joi from "joi";

const deleteCommentV1Dto = {
  params: {
    commentId: Joi.string().required().trim(),
  },
};

export default deleteCommentV1Dto;
