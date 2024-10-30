import Joi from "joi";

const downloadBookV1Dto = {
  body: {
    fileName: Joi.string().required(),
    bookId: Joi.number().required(),
  },
};

export default downloadBookV1Dto;
