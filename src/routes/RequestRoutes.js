import { Router } from 'express';
import UserAuthentication from '../middlewares/UserAuthentication';
import AttachUser from '../middlewares/AttachUser';
import Validation from '../validation/Validations';
import RequestController from '../controllers/RequestController';
import validate from '../middlewares/RequestValidation';
import { queryValidation, errorCheck } from '../validation/QueryValidation';
import CommentController from '../controllers/CommentController';
import { commentdata, validator } from '../validation/UserValidation';
import checkCookies from '../middlewares/checkCookies';

const router = new Router();

const { verifyToken } = UserAuthentication;
const { reqAttachUser } = AttachUser;
const {
  createComment,
  getUserRequestComments,
  editRequestComment,
  deleteComment
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
  deleteRequest
} = RequestController;

const {
  validateUpdateRequest,
  updateRequestValidator,
  validateRequestData,
  validateNewRequest,
  validateRequestAdmin
} = Validation;
router.get('/', verifyToken, getRequests);
router.get('/mostTravelledDestinations', [verifyToken], mostTravelledDestinations);
// router.post('/', [verifyToken, validate], validateRequestData, validateNewRequest, createRequest);
router.post('/', [verifyToken, checkCookies, validate], validateRequestData, validateNewRequest, createRequest);

router.get('/:id([0-9]{1,11})/:action(approve|reject)/:token?', reqAttachUser, validateRequestAdmin, requestAction);
router.patch('/:id', verifyToken, updateRequestValidator, validateUpdateRequest, updateRequest);
router.get('/manager', verifyToken, managerRequests);
router.get('/search', verifyToken, queryValidation(), errorCheck, searchRequests);

// comments
router.post(
  '/:request_id/comments',
  commentdata,
  validator,
  verifyToken,
  createComment
);
router.get('/:request_id/comments', verifyToken, getUserRequestComments);
router.patch(
  '/:request_id/comments/:comment_id',
  commentdata,
  validator,
  verifyToken,
  editRequestComment
);

router.patch('/remember/:autofill', verifyToken, setAutoFill);
router.delete('/:request_id/comments/:comment_id', verifyToken, deleteComment);
router.delete('/:request_id/', verifyToken, deleteRequest);


export default router;
