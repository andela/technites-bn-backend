import { Router } from 'express';
import multiparty from 'connect-multiparty';
import AccomodationController from '../controllers/AccomodationController';
import UserAuthentication from '../middlewares/UserAuthentication';
import { validator, accommodationData } from '../validation/UserValidation';
import Validation from '../validation/Validations';

const multipartyMiddle = multiparty();
const router = new Router();

const { verifyToken } = UserAuthentication;
const {
  createAccomodation,
  createHostAccommodation,
  createRoom,
  viewSingleRoom,
  viewSingleAccommodation,
  viewAllRoomsByAccommodation,
  viewAllAccommodations,
  viewAllAccommodationsByLocation
} = AccomodationController;
const {
  validateHostAccommodations, validateAccommodations, validateRooms, validateNewRoom
} = Validation;

router.post('/', verifyToken, multipartyMiddle, accommodationData, validator, createAccomodation);
router.post('/hosts', verifyToken, multipartyMiddle, validateHostAccommodations, validateAccommodations, createHostAccommodation);
router.post('/rooms', verifyToken, multipartyMiddle, validateRooms, validateNewRoom, createRoom);
router.get('/', viewAllAccommodations);
router.get('/location/:id', viewAllAccommodationsByLocation);
router.get('/:id', viewSingleAccommodation);
router.get('/:id/rooms', viewAllRoomsByAccommodation);
router.get('/:accomodationid/rooms/:id', viewSingleRoom);

export default router;
