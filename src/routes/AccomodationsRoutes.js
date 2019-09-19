import { Router } from 'express';
import multiparty from 'connect-multiparty';
import AccomodationController from '../controllers/AccomodationController';
import UserAuthentication from '../middlewares/UserAuthentication';
import { validator, accommodationData } from '../validation/UserValidation';

const multipartyMiddle = multiparty();
const router = new Router();

const { verifyToken } = UserAuthentication;
const { createAccomodation } = AccomodationController;

router.post('/', verifyToken, multipartyMiddle, accommodationData, validator, createAccomodation);

export default router;
