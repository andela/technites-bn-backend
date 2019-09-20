/* eslint-disable no-irregular-whitespace */
import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerDoc from '../../swagger.json';
import AuthRoutes from './AuthRoutes';
import UserRoutes from './UserRoutes';
import AdminRoute from './AdminRoutes';
import AccommodationRoutes from './AccomodationsRoutes';

const router = new Router();

router.use('/auth', AuthRoutes);
router.use('/users', UserRoutes);
router.use('/accommodations', AccommodationRoutes);

router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

router.use('/admin', AdminRoute);

export default router;
