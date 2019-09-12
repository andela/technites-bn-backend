import { Router } from 'express';
import UserController from '../controllers/UserController';
import Validation from '../validation/Validations';

const router = new Router();

const { resetValidator, credentialsValidator } = Validation;
const {
  reset, updateCredentials, register
} = UserController;

router.post('/reset', resetValidator, reset);

router.put('/reset/:token', credentialsValidator, updateCredentials);


router.get('/user');

router.post('/login');

router.post('/register', register);

export default router;
