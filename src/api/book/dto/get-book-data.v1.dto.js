import Joi from "joi";

const getBookDataV1DTO = {
  params: {
    id: Joi.string().required().trim(),
  },
};

export default getBookDataV1DTO;
