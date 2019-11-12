import { Router } from 'express';
import UserAuthentication from '../middlewares/UserAuthentication';
import AttachUser from '../middlewares/AttachUser';
import Validation from '../validation/Validations';
import RequestController from '../controllers/RequestController';
import validate from '../middlewares/RequestValidation';
import checkCookies from '../middlewares/checkCookies';
import { queryValidation, errorCheck } from '../validation/QueryValidation';
import CommentController from '../controllers/CommentController';
import { commentdata, validator } from '../validation/UserValidation';

const router = new Router();

const { verifyToken } = UserAuthentication;
const { reqAttachUser } = AttachUser;
const {
  createComment, getUserRequestComments, editRequestComment, deleteComment
} = CommentController;

const {
  updateRequest,
  createRequest,
  requestAction,
  getRequests,
  searchRequests,
  managerRequests,
  mostTravelledDestinations,
  setAutoFill,
} = RequestController;

const {
  validateUpdateRequest,
  updateRequestValidator,
  validateNewRequest,
  validateRequestAdmin
} = Validation;
router.get('/', verifyToken, getRequests);
router.get('/', [verifyToken], mostTravelledDestinations);
router.post('/', [verifyToken, checkCookies, validate], validateNewRequest, createRequest);
router.get('/:id([0-9]{1,11})/:action(approve|reject)/:token?', reqAttachUser, validateRequestAdmin, requestAction);
router.patch('/remember/:autofill', verifyToken, setAutoFill);
router.patch('/:id', verifyToken, updateRequestValidator, validateUpdateRequest, updateRequest);
router.get('/manager', verifyToken, managerRequests);
router.get('/search', verifyToken, queryValidation(), errorCheck, searchRequests);

// comments
router.post('/:request_id/comments', commentdata, validator, verifyToken, createComment);
router.get('/:request_id/comments', verifyToken, getUserRequestComments);
router.patch('/:request_id/comments/:comment_id', commentdata, validator, verifyToken, editRequestComment);
router.delete('/:request_id/comments/:comment_id', verifyToken, deleteComment);


export default router;
