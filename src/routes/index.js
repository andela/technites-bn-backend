import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerDoc from '../../swagger.json';
import api from './api';

const router = new Router();

router.use('/api/v1', api);
router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

export default router;
