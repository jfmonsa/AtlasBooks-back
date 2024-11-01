import Joi from "joi";

const searchListsV1Dto = {
  query: {
    listName: Joi.string().required().trim(),
  },
};

export default searchListsV1Dto;
