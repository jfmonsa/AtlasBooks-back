import Joi from "joi";

const banUserV1DTO = {
  body: {
    userIdToBan: Joi.string().required().trim(),
  },
};

export default banUserV1DTO;
