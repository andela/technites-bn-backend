import { Router } from 'express';
import UserAuthentication from '../middlewares/UserAuthentication';
import Validation from '../validation/Validations';
import RequestController from '../controllers/RequestController';
import validate from '../middlewares/RequestValidation';
import { queryValidation, errorCheck } from '../validation/QueryValidation';


const router = new Router();

const { verifyToken } = UserAuthentication;
const {
  createRequest, getRequests, approveRequest, rejectRequest, updateRequest, searchRequests
} = RequestController;

const { validateUpdateRequest, updateRequestValidator } = Validation;

router.post('/', [verifyToken, validate], createRequest);
router.post('/:id/requests/:req_id/approve', [verifyToken], approveRequest);
router.post('/:id/requests/:req_id/reject', [verifyToken], rejectRequest);
router.patch('/:id', verifyToken, updateRequestValidator, validateUpdateRequest, updateRequest);
router.get('/', verifyToken, getRequests);
router.get('/search', verifyToken, queryValidation(), errorCheck, searchRequests);

export default router;
