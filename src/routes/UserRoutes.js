import { Router } from 'express';
import connect from 'connect-multiparty';
import UserController from '../controllers/UserController';
import UserAuthentication from '../middlewares/UserAuthentication';
import Validation from '../validation/Validations';


const router = new Router();

const connection = connect();

const { verifyToken } = UserAuthentication;
const {
  editProfile, viewSingleProfile, viewAllProfiles, viewProfilesByCompany
} = UserController;

const { updateProfileValidator } = Validation;

router.patch('/editprofile', verifyToken, connection, updateProfileValidator, editProfile);

router.get('/:id', viewSingleProfile);

router.get('/', viewAllProfiles);

router.get('/company/:company', viewProfilesByCompany);

export default router;
