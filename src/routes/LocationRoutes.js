import { Router } from 'express';
import LocationController from '../controllers/LocationController';

const router = new Router();
const { getLocations } = LocationController;

router.get('/', getLocations);

export default router;
