import Joi from "joi";

const searchUsersV1Dto = {
  query: {
    search: Joi.string().required().trim(),
  },
};

export default searchUsersV1Dto;
