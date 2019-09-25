import { sanitizeBody } from 'express-validator';

const { check, validationResult } = require('express-validator');

export const loginData = [
  check('email')
    .exists()
    .withMessage('Invalid user credentials')
    .trim(),
  check('password')
    .exists({
      checkNull: true,
      checkFalsy: true
    })
    .withMessage('Invalid user credentials'),
  sanitizeBody('notifyOnReply').toBoolean()
];
export const changeRoleData = [
  check('email').isLength({ min: 3, max: 256 })
    .not()
    .isEmpty()
    .withMessage('Email field cannot be empty')
    .isEmail()
    .withMessage('Email entered is not of type "email"')
    .normalizeEmail()
    .trim(),
  check('new_role').isInt()
    .withMessage('new_role value can only be an integer')
    .not()
    .isEmpty()
    .isIn([1, 2, 3, 4, 5, 6, 7])
    .withMessage('new_role value can only take a value between 1 and 7')
];
export const registerData = [
  check('firstname').isLength({ min: 2, max: 30 })
    .withMessage('Firstname must have 2 or more characters')
    .not()
    .isInt()
    .withMessage('Integer is not allowed as a first name')
    .trim()
    .isAlpha()
    .withMessage('Should only contain letters')
    .escape(),
  check('lastname').isLength({ min: 2, max: 30 })
    .withMessage('Lastname must have 2 or more characters')
    .not()
    .isEmpty()
    .not()
    .isInt()
    .withMessage('Integer not allowed as  lastname')
    .trim()
    .isAlpha()
    .withMessage('Should only contain letters')
    .escape(),
  check('username').isLength({ min: 3, max: 30 })
    .withMessage('Username must have 2 or more characters')
    .not()
    .isEmpty()
    .not()
    .isInt()
    .withMessage('Integer not allowed as  username')
    .trim()
    .escape(),
  check('email', 'Your email is not valid').isLength({ min: 3, max: 256 })
    .not()
    .isEmpty()
    .isEmail()
    .normalizeEmail()
    .trim(),
  check('password', 'Your password must be at least 6 characters').isLength({ min: 6, max: 30 })
    .exists()
    .matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$.!%*#?&])[A-Za-z\d@$.!%*#?&]{6,}$/)
    .withMessage('Password should at least have one letter, one number and one special character')
    .trim()
    .not()
    .equals('password')
    .withMessage('Password cannot be password')
    .escape(),
  sanitizeBody('notifyOnReply').toBoolean()
];

export const accommodationData = [
  check('accommodation_name')
    .exists()
    .withMessage('Accommodation name is required')
    .trim(),
  check('room_type')
    .exists()
    .withMessage('Room type is required')
    .trim(),
  check('description')
    .exists()
    .withMessage('Description of the rooms is required')
    .trim(),
  check('location')
    .exists()
    .withMessage('Location of the accommodation facility is required')
    .trim(),
  check('quantity')
    .exists()
    .isInt()
    .withMessage('Quantity should be an integer and is required')
    .trim(),
  sanitizeBody('notifyOnReply').toBoolean()
];
export const commentdata = [
  check('comment')
    .not()
    .isEmpty()
    .withMessage('comment can not be empty')
    .exists()
    .withMessage('comment field required')
    .trim(),
];

export const validator = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).send({ status: 422, error: errors.array() });
  }
  next();
};
