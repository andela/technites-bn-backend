import { Router } from 'express';
import connect from 'connect-multiparty';
import UserController from '../controllers/UserController';
import UserAuthentication from '../middlewares/UserAuthentication';
import Validation from '../validation/Validations';
import RequestController from '../controllers/RequestController';
import CommentController from '../controllers/CommentController';
import { commentdata, validator } from '../validation/UserValidation';


const router = new Router();

const connection = connect();

const { verifyToken } = UserAuthentication;
const {
  editProfile, viewSingleProfile, viewAllProfiles, viewProfilesByCompany
} = UserController;

const {
  getRequests, approveRequest, rejectRequest
} = RequestController;

const {
  createComment, getUserRequestComments, editRequestComment, deleteComment
} = CommentController;
const { updateProfileValidator } = Validation;

// profiles
router.patch('/editprofile', verifyToken, connection, updateProfileValidator, editProfile);
router.get('/user/:id', viewSingleProfile);
router.get('/users/all', viewAllProfiles);
router.get('/users/company/:company', viewProfilesByCompany);

// requests approvals
router.get('/users/:id/requests', verifyToken, getRequests);
router.post('/users/:id/requests/:req_id/approve', [verifyToken], approveRequest);
router.post('/users/:id/requests/:req_id/reject', [verifyToken], rejectRequest);

// comments
router.post('/requests/:request_id/comments', commentdata, validator, verifyToken, createComment);
router.get('/requests/:request_id/comments', verifyToken, getUserRequestComments);
router.patch('/requests/:request_id/comments/:comment_id', commentdata, validator, verifyToken, editRequestComment);
router.delete('/requests/:request_id/comments/:comment_id', verifyToken, deleteComment);
export default router;
