import Joi from "joi";

const downloadBookV1Dto = {
  body: {
    fileName: Joi.string().required().trim(),
    bookId: Joi.string().required().trim(),
  },
};

export default downloadBookV1Dto;
