/* eslint-disable lines-between-class-members */
/* eslint-disable require-jsdoc */
import Joi from '@hapi/joi';
import PasswordComplexity from 'joi-password-complexity';

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
    const complexityOptions = {
      min: 6,
      max: 30,
      lowerCase: 1,
      upperCase: 1,
      numeric: 1,
      symbol: 1,
    };
    const schema = Joi.object().keys({
      password: new PasswordComplexity(complexityOptions).required(),
      confirm_password: Joi.string().required()
    });
    genericValidator(req, res, schema, next);
  }
}
