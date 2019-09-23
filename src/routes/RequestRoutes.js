import { Router } from 'express';
import UserAuthentication from '../middlewares/UserAuthentication';
import Validation from '../validation/Validations';
import RequestController from '../controllers/RequestController';

const router = new Router();

const { verifyToken } = UserAuthentication;

const {
  updateRequest
} = RequestController;

const { validateUpdateRequest, updateRequestValidator } = Validation;


router.patch('/:id', verifyToken, updateRequestValidator, validateUpdateRequest, updateRequest);

export default router;
