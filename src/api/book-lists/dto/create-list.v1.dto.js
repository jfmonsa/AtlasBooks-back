import Joi from "joi";

const createListV1DTO = {
  body: {
    title: Joi.string().required().trim(),
    description: Joi.string().required().trim(),
    isPublic: Joi.boolean().required(),
  },
};

export default createListV1DTO;
