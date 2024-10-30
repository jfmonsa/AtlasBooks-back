import Joi from "joi";

const getBookDataV1DTO = {
  params: {
    id: Joi.number().required(),
  },
};

export default getBookDataV1DTO;
