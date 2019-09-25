/* eslint-disable no-restricted-globals */
/* eslint-disable lines-between-class-members */
/* eslint-disable require-jsdoc */
import Joi from '@hapi/joi';
import PasswordComplexity from 'joi-password-complexity';
import RequestServices from '../services/RequestServices';
import Util from '../utils/Utils';

const { searchRequest } = RequestServices;
const util = new Util();

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
  static updateProfileValidator(req, res, next) {
    const schema = Joi.object().keys({
      email: Joi.string().email({ minDomainSegments: 2 }),
      firstname: Joi.string().min(2).max(30),
      lastname: Joi.string().min(2).max(30),
      username: Joi.string().min(2).max(30),
      phone: Joi.string().min(9).max(10),
      gender: Joi.string().regex(/^(Male|Female|MALE|FEMALE|male|female)$/),
      dob: Joi.date(),
      address: Joi.string().min(2).max(30),
      country: Joi.string().min(2).max(30),
      language: Joi.string().min(2).max(30),
      currency: Joi.string().min(2).max(30),
      company: Joi.string().min(2).max(30),
      department: Joi.string().min(2).max(30),
      line_manager: Joi.string(),
    });
    genericValidator(req, res, schema, next);
  }
  static updateRequestValidator(req, res, next) {
    const schema = Joi.object().keys({
      request_type: Joi.string().regex(/^(OneWay|ReturnTrip)$/),
      location_id: Joi.number().integer().min(1),
      departure_date: Joi.string().min(1).max(50),
      return_date: Joi.string().min(1).max(50),
      destinations: Joi.string().min(1).max(255),
      reason: Joi.string().min(1).max(255),
    });
    genericValidator(req, res, schema, next);
  }
  /**
   *
   * @param {Object} req
   * @param {Object} res
   * @returns {Object} newUser
   */
  static validateRequest(req) {
    let schema = null;

    if (req.body.request_type === 'ReturnTrip') {
      schema = {
        request_type: Joi.string().required().min(1).max(255),
        location_id: Joi.number().integer().required().min(1),
        departure_date: Joi.string().required().min(1).max(50),
        return_date: Joi.string().required().min(1).max(50),
        destinations: Joi.string().required().min(1).max(255),
        reason: Joi.string().required().min(1).max(255),
      };
    } else {
      schema = {
        request_type: Joi.string().required().min(1).max(255),
        location_id: Joi.number().integer().required().min(1),
        departure_date: Joi.string().required().min(1).max(50),
        destinations: Joi.string().required().min(1).max(255),
        reason: Joi.string().required().min(1).max(255),
      };
    }


    return Joi.validate(req.body, schema);
  }
  static async validateUpdateRequest(req, res, next) {
    // Check whether param is a valid Id
    if (isNaN(req.params.id)) {
      util.setError(403, 'Request id must be a valid Integer');
      return util.send(res);
    }
    // check whether user has added his line manager
    if (req.user.line_manager === null) {
      util.setError(403, 'Kindly edit your profile and add your line manager email');
      return util.send(res);
    }
    const searchReq = await searchRequest(req.params.id);
    // search if Request exists
    if (!searchReq) {
      util.setError(404, 'Request not found');
      return util.send(res);
    }
    // check to whom Request belongs
    if (searchReq.user_id !== req.user.id) {
      util.setError(403, 'You are not allowed to edit another user request');
      return util.send(res);
    }
    // check if request is still pending
    if (searchReq.status !== 'Pending') {
      util.setError(403, `Request is alredy ${searchReq.status}, you are only allowed to edit Pending requests`);
      return util.send(res);
    }
    req.userRequest = searchReq;
    next();
  }
}
