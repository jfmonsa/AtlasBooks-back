import Joi from "joi";

const getListsWhereBookIsV1DTO = {
  params: {
    bookId: Joi.string().required().trim(),
  },
};

export default getListsWhereBookIsV1DTO;
