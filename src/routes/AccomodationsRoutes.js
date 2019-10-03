import { Router } from 'express';
import multiparty from 'connect-multiparty';
import AccomodationController from '../controllers/AccomodationController';
import RatingController from '../controllers/RatingController';
import FeedbackController from '../controllers/FeedbackController';
import UserAuthentication from '../middlewares/UserAuthentication';
import {
  validator, feedbackData, accommodationData, checkIsInt
} from '../validation/UserValidation';
import Validation from '../validation/Validations';

const multipartyMiddle = multiparty();
const router = new Router();
const { validateRating } = Validation;
const { verifyToken } = UserAuthentication;
const { getRate, addRate, rating } = RatingController;
const {
  createAccomodation,
  createHostAccommodation,
  createRoom,
  viewSingleRoom,
  viewSingleAccommodation,
  viewAllRoomsByAccommodation,
  viewAllAccommodations,
  viewAllAccommodationsByLocation,
  likeAccommodation
} = AccomodationController;
const {
  validateHostAccommodations, validateAccommodations, validateRooms, validateNewRoom, validateLike
} = Validation;

const {
  addFeedback, getAllFeedbacks, getFeedbackById
} = FeedbackController;

router.post('/', verifyToken, multipartyMiddle, accommodationData, validator, createAccomodation);
router.post('/hosts', verifyToken, multipartyMiddle, validateHostAccommodations, validateAccommodations, createHostAccommodation);
router.post('/rooms', verifyToken, multipartyMiddle, validateRooms, validateNewRoom, createRoom);
router.get('/', viewAllAccommodations);
router.get('/location/:id', viewAllAccommodationsByLocation);
router.get('/:id([0-9]{1,11})', viewSingleAccommodation);
router.get('/:id/rooms', viewAllRoomsByAccommodation);
router.get('/:accomodationid/rooms/:id', viewSingleRoom);
router.post('/:id/like', verifyToken, validateLike, likeAccommodation);
router.get('/:accommodation_id([0-9]{1,11})/rating', verifyToken, getRate);
router.patch('/:accommodation_id([0-9]{1,11})/rating', verifyToken, validateRating, addRate);
router.get('/:accommodation_id([0-9]{1,11})/ratings', rating);
router.get('/:id', checkIsInt, validator, viewSingleAccommodation);
router.get('/:id/rooms', checkIsInt, validator, viewAllRoomsByAccommodation);
router.get('/:accomodationid/rooms/:id', checkIsInt, validator, viewSingleRoom);

// Accommodation feedback
router.post('/:accommodation_id/feedbacks', feedbackData, checkIsInt, validator, verifyToken, addFeedback);
router.get('/:accommodation_id/feedbacks', verifyToken, checkIsInt, validator, getAllFeedbacks);
router.get('/:accommodation_id/feedbacks/:feedback_id', verifyToken, checkIsInt, validator, getFeedbackById);

export default router;
