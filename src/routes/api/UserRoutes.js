/* eslint-disable no-unused-vars */
import { Router } from 'express';
import UserController from '../../controllers/UserController';
import Validation from '../../validation/Validations';
import wrongMethod from '../../middlewares/router/WrongMethod';

const passport = require('passport');

const router = new Router();

const { resetValidator, credentialsValidator } = Validation;
const {
  reset, updateCredentials
} = UserController;

router.route('/auth/reset').post(resetValidator, reset).all(wrongMethod);

router.route('/auth/reset/:token').patch(credentialsValidator, updateCredentials).all(wrongMethod);

router.get('/user', (req, res, next) => {});

router.put('/user', (req, res, next) => {});

router.post('/users/login', (req, res, next) => {
  if (!req.body.user.email) {
    return res.status(422).json({ errors: { email: "can't be blank" } });
  }

  if (!req.body.user.password) {
    return res.status(422).json({ errors: { password: "can't be blank" } });
  }
  passport.authenticate('local', { session: false }, (
    err,
    user,
    info
  ) => {
    if (err) {
      return next(err);
    }

    if (user) {
      // TODO: retrieve user and return it
      return res.json({ user: {} });
    }
    return res.status(422).json(info);
  })(req, res, next);
});

router.post('/users', (req, res, next) => {});

export default router;
