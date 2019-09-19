import { Router } from 'express';
import AdminController from '../controllers/AdminController';
import UserAuthentication from '../middlewares/UserAuthentication';
import { changeRoleData, validator } from '../validation/UserValidation';

const router = new Router();

const { changeRole } = AdminController;
const { verifyToken, isSuperAdmin } = UserAuthentication;

router.put('/users', changeRoleData, validator, verifyToken, isSuperAdmin, changeRole);

export default router;
