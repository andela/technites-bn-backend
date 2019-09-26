import { Router } from 'express';
import connect from 'connect-multiparty';
import UserController from '../controllers/UserController';
import UserAuthentication from '../middlewares/UserAuthentication';
import Validation from '../validation/Validations';
import RequestController from '../controllers/RequestController';

const router = new Router();

const connection = connect();

const { verifyToken } = UserAuthentication;
const {
  editProfile, viewSingleProfile, viewAllProfiles, viewProfilesByCompany
} = UserController;

const {
  getRequests, approveRequest, rejectRequest
} = RequestController;

const { updateProfileValidator } = Validation;

// profilea
router.patch('/editprofile', verifyToken, connection, updateProfileValidator, editProfile);
router.get('/:id', viewSingleProfile);
router.get('/', viewAllProfiles);

router.get('/company/:company', viewProfilesByCompany);

// requests
router.get('/:id/requests', verifyToken, getRequests);
router.post('/:id/requests/:req_id/approve', [verifyToken], approveRequest);
router.post('/:id/requests/:req_id/reject', [verifyToken], rejectRequest);

export default router;
