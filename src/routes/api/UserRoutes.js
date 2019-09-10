import { Router } from 'express';
import UserController from '../../controllers/UserController';

const { register } = UserController;
const router = new Router();


router.get('/user');

router.post('/auth/login');

router.post('/auth/register', register);

export default router;
