import { Router } from 'express';
import UserController from '../controllers/UserController';

const { register } = UserController;
const router = new Router();


router.get('/user');

router.post('/login');

router.post('/register', register);

export default router;
