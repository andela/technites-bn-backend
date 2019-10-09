import { Router } from 'express';
import connect from 'connect-multiparty';
import UserController from '../controllers/UserController';
import UserAuthentication from '../middlewares/UserAuthentication';
import Validation from '../validation/Validations';
import RequestController from '../controllers/RequestController';
import { checkIsInt, validator } from '../validation/UserValidation';

const router = new Router();

const connection = connect();

const { verifyToken } = UserAuthentication;
const {
  editProfile, viewSingleProfile, viewAllProfiles,
  viewProfilesByCompany, enableOrDisableEmailNotifications, getUserTrips,
  markNotificationsAsSeen, getAllNotifications
} = UserController;

const { getRequests } = RequestController;

const { updateProfileValidator } = Validation;

// profiles
router.patch('/editprofile', verifyToken, connection, updateProfileValidator, editProfile);
router.post('/notifications', [verifyToken], enableOrDisableEmailNotifications);
router.get('/notifications', [verifyToken], getAllNotifications);
router.get('/:id', viewSingleProfile);
router.get('/', viewAllProfiles);
router.get('/company/:company', viewProfilesByCompany);
router.patch('/notifications/seen', [verifyToken], markNotificationsAsSeen);

// get requests
router.get('/:id/requests', verifyToken, getRequests);

// get user trips
router.get('/:id/trips?', checkIsInt, validator, verifyToken, getUserTrips);

export default router;
