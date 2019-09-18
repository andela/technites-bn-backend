import { Router } from 'express';
import UserAuthentication from '../middlewares/UserAuthentication';
import RequestController from '../controllers/RequestController';

const router = new Router();

const { verifyToken } = UserAuthentication;
const { getRequests } = RequestController;

router.get('/:id/requests', verifyToken, getRequests);

export default router;
