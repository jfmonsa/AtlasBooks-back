import Joi from "joi";

const getListV1DTO = {
  params: {
    id: Joi.string().required().trim(),
  },
};

export default getListV1DTO;
