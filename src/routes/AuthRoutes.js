import { Router } from 'express';
import UserController from '../controllers/UserController';
import Validation from '../validation/Validations';
import UserAuthentication from '../middlewares/UserAuthentication';
import database from '../database/models';
import passport from '../config/passport';
import OAuthController from '../controllers/OAuthController';

import { registerData, validator, loginData } from '../validation/UserValidation';

const router = new Router();

const {
  reset, updateCredentials, register, loginUser, logoutUser
} = UserController;
const { resetValidator, credentialsValidator } = Validation;
const { verifyToken } = UserAuthentication;
const { loginCallback } = OAuthController;

router.post('/reset', resetValidator, reset);
router.put('/reset/:token', credentialsValidator, updateCredentials);
router.post('/login', loginData, validator, loginUser);
router.post('/logout', verifyToken, logoutUser);
router.post('/register', registerData, validator, register);
router.get('/google', passport.authenticate('google', {
  scope: [
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email'
  ]
}));
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), loginCallback);
router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));
router.get('/fb/callback', passport.authenticate('facebook', { failureRedirect: '/api/v1/auth/facebook' }), loginCallback);

router.get('/login/:token', verifyToken, async (req, res) => {
  await database.User.update({ is_verified: true }, { where: { email: req.user.email } });

  res.json({ status: 200, message: 'Your account is now verified' });
});

export default router;
