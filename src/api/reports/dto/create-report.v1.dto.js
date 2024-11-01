import Joi from "joi";

const createReportV1Dto = {
  body: {
    motivation: Joi.string().required().trim(),
    idBook: Joi.string().required().trim(),
  },
};

export default createReportV1Dto;
