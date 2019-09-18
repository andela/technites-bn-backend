import { Router } from 'express';
import fileUpload from 'express-fileupload';
import AccomodationController from '../controllers/AccomodationController';
import UserAuthentication from '../middlewares/UserAuthentication';
import { validator, accommodationData } from '../validation/UserValidation';

const router = new Router();
router.use(fileUpload({ useTempFiles: true }));

const { verifyToken } = UserAuthentication;
const { createAccomodation } = AccomodationController;

router.post('/create', accommodationData, validator, verifyToken, createAccomodation);
// router.get('/all', getAvailableAccomodations);
// router.get('/available', getAvailableAccomodations);
// router.get('/:id', getSpecificAccomodation);

export default router;
