import Joi from "joi";

const changeEmailConfirmedDTO = {
  body: {
    token: Joi.string().required(),
  },
};

export default changeEmailConfirmedDTO;
