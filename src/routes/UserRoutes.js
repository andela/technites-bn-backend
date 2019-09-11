import { Router } from 'express';
import UserController from '../controllers/UserController';
import UserValidation from '../validation/UserValidation';
import UserAuthentication from '../middlewares/UserAuthentication';

const { register } = UserController;
const router = new Router();

// const { loginDataValidation } = UserValidation;
const { loginUser } = UserController;
const { loginCheck } = UserAuthentication;
const { loginDataValidation } = UserValidation;

router.post('/register', register);
router.post('/login', loginDataValidation(), loginCheck, loginUser);
router.get('/user');

export default router;
