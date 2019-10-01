import { Router } from 'express';
import HostController from '../controllers/HostController';
import UserAuthentication from '../middlewares/UserAuthentication';
import Validation from '../validation/Validations';

const router = new Router();
const {
  validateAddHost, validateAddHostFields, resetHostValidator, validateHostReset
} = Validation;
const {
  addHost,
  resetHost
} = HostController;
const { verifyToken } = UserAuthentication;

router.post('/', verifyToken, validateAddHostFields, validateAddHost, addHost);

router.patch('/reset', resetHostValidator, validateHostReset, resetHost);

export default router;
