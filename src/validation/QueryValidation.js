/* eslint-disable require-jsdoc */
import { oneOf, buildCheckFunction, validationResult } from 'express-validator';

export function queryValidation() {
  const checkQuery = buildCheckFunction(['query']);
  return oneOf([
    checkQuery('key_word', 'key_word: should be a sting').isString(),
    checkQuery('status', 'status: should be queried from pending, approved or rejected').isIn(['pending', 'approved', 'rejected']),
    checkQuery('request_type', 'request_type: should be either "oneway" or "twoway"').isString(),
    checkQuery('destinations', 'destinations: should be a string').isString(),
    checkQuery('beforeDate', 'beforeDate: should be a date in the format YYYY-MM-DD').isISO8601(),
    checkQuery('afterDate', 'afterDate: should be a date in the format YYYY-MM-DD').isISO8601(),
  ]);
}

export const errorCheck = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const { nestedErrors, msg } = errors.array()[0];
    const errorList = Object.keys(nestedErrors).map((err) => nestedErrors[err].msg);
    return res.status(400).send({ status: 400, error: msg, errorMessage: nestedErrors });
  }
  next();
};
