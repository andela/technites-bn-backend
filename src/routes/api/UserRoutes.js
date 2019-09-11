import { Router } from 'express';
import UserController from '../../controllers/UserController';
import UserValidation from '../../validation/UserValidation';
import UserAuthentication from '../../middlewares/UserAuthentication';

const router = new Router();
const { loginDataValidation } = UserValidation;
const { loginUser } = UserController;
const { loginCheck } = UserAuthentication;

router.post('/login', loginCheck, loginUser);

export default router;
