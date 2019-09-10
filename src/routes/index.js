import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerDoc from '../../swagger.json';
import UserRoute from './UserRoutes';

const router = new Router();

router.use('/auth', UserRoute);
router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

export default router;
