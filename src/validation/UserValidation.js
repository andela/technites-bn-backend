import { check } from 'express-validator';

/**
   * @class ValidateUser
   * @description Validates all the details a user provide
   * @returns {array} - Array of validation methods
   */
export default class ValidateUser {
  /**
     * @method loginDataValidation
     * @description Ensure details provided by user are precise
     * @returns {array} - Array containing validation methods
     */
  static loginDataValidation() {
    return [
      check('email')
        .exists({
          checkNull: true,
          checkFalsy: true
        })
        .withMessage('Email is required to login'),

      check('password')
        .exists({
          checkNull: true,
          checkFalsy: true
        })
        .withMessage('Password is required to login')
    ];
  }
}
