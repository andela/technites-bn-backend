/* eslint-disable import/no-cycle */
import { Router } from 'express';
import connect from 'connect-multiparty';
import UserController from '../controllers/UserController';
import UserAuthentication from '../middlewares/UserAuthentication';
import Validation from '../validation/Validations';
import RequestController from '../controllers/RequestController';
import ChatController from '../controllers/ChatController';
import { checkIsInt, validator } from '../validation/UserValidation';

const router = new Router();

const connection = connect();

const { verifyToken } = UserAuthentication;
const {
  editProfile, viewSingleProfile, viewAllProfiles,
  viewProfilesByCompany, enableOrDisableEmailNotifications, getUserTrips,
  markNotificationsAsSeen, getAllNotifications, markOneSeenNotification
} = UserController;

const { getRequests } = RequestController;

const { updateProfileValidator, validateMessage } = Validation;

const { sendMessage, fetchMessages } = ChatController;

// chats
router.post('/chat', verifyToken, validateMessage, sendMessage);
router.get('/chat', verifyToken, fetchMessages);

// profiles
router.patch('/editprofile', verifyToken, connection, updateProfileValidator, editProfile);
router.post('/notifications', [verifyToken], enableOrDisableEmailNotifications);
router.get('/notification/:id/seen', checkIsInt, validator, [verifyToken], markOneSeenNotification);
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
