import { Router } from 'express';
import UserAuthentication from '../middlewares/UserAuthentication';
import Validation from '../validation/Validations';
import RequestController from '../controllers/RequestController';
import validate from '../middlewares/RequestValidation';

const router = new Router();

const { verifyToken } = UserAuthentication;

const {
  updateRequest, createRequest
} = RequestController;

const { validateUpdateRequest, updateRequestValidator } = Validation;


router.post('/', [verifyToken, validate], createRequest);
router.patch('/:id', verifyToken, updateRequestValidator, validateUpdateRequest, updateRequest);

export default router;
