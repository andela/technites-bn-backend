import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerDoc from '../../swagger.json';
import AuthRoutes from './AuthRoutes';
import UserRoutes from './UserRoutes';

const router = new Router();

router.use('/auth', AuthRoutes);
router.use('/users', UserRoutes);

router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

export default router;
