import { Router } from 'express';
import UserAuthentication from '../middlewares/UserAuthentication';
import AttachUser from '../middlewares/AttachUser';
import Validation from '../validation/Validations';
import RequestController from '../controllers/RequestController';
import validate from '../middlewares/RequestValidation';
import { queryValidation, errorCheck } from '../validation/QueryValidation';


const router = new Router();

const { verifyToken } = UserAuthentication;
const { reqAttachUser } = AttachUser;

const {
  updateRequest,
  createRequest,
  requestAction,
  getRequests,
  searchRequests
} = RequestController;

const { validateUpdateRequest, updateRequestValidator } = Validation;

router.post('/', [verifyToken, validate], createRequest);
router.get('/:id([0-9]{1,11})/:action(approve|reject)/:token?', reqAttachUser, requestAction);
router.patch('/:id', verifyToken, updateRequestValidator, validateUpdateRequest, updateRequest);
router.get('/', verifyToken, getRequests);
router.get('/search', verifyToken, queryValidation(), errorCheck, searchRequests);

export default router;
