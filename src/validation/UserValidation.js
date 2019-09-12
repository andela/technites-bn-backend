import { sanitizeBody } from 'express-validator';

const { check, validationResult } = require('express-validator/check');

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

export const data = [
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
export const validator = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).send({ status: 422, error: errors.array() });
  }
  next();
};
