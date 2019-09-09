/* eslint-disable lines-between-class-members */
/* eslint-disable require-jsdoc */
import Joi from '@hapi/joi';

export const genericValidator = (req, res, schema, next) => {
  const { error } = Joi.validate(req.body, schema, {
    abortEarly: false,
    convert: true,
  });
  if (error) {
    const errors = [];
    const { details: errArr = [] } = error || {};
    errArr.forEach((err) => {
      errors.push(err.message.split('"').join(''));
    });
    return res.status(400).json({
      status: res.statusCode,
      errors,
    });
  }
  return next();
};

export default class Validation {
  static resetValidator(req, res, next) {
    const schema = Joi.object().keys({
      email: Joi.string()
        .email({ minDomainSegments: 2 })
        .required(),
    });
    genericValidator(req, res, schema, next);
  }
  static credentialsValidator(req, res, next) {
    const schema = Joi.object().keys({
      password: Joi.string()
        .min(6)
        .max(50)
        .required(),
      confirm_password: Joi.string()
        .min(6)
        .max(50)
        .required(),
    });
    genericValidator(req, res, schema, next);
  }
}
