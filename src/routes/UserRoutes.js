import { Router } from 'express';
import UserController from '../controllers/UserController';
import Validation from '../validation/Validations';
import UserAuthentication from '../middlewares/UserAuthentication';
import database from '../database/models';

const router = new Router();

const { resetValidator, credentialsValidator } = Validation;
const {
  reset, updateCredentials, register
} = UserController;
const { verifyToken } = UserAuthentication;
router.post('/reset', resetValidator, reset);

router.put('/reset/:token', credentialsValidator, updateCredentials);


router.get('/user');

router.post('/login');

router.post('/register', register);

router.get('/login/:token', verifyToken, async (req, res) => {
  await database.User.update({ is_verified: true }, { where: { email: req.user.email } });

  res.json({ status: 200, message: 'Your account is now verified' });
});

export default router;
