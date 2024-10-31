import Joi from "joi";

const updateCommentV1DTO = {
  body: {
    text: Joi.string().required().trim(),
    commentId: Joi.string().required().trim(),
  },
};

export default updateCommentV1DTO;
