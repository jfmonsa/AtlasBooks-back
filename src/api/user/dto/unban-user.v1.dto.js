import Joi from "joi";

const unbanUserV1DTO = {
  body: {
    userIdToUnban: Joi.string().required().trim(),
  },
};

export default unbanUserV1DTO;
