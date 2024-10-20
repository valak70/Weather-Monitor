// backend/routes/alertRoutes.js
import express from 'express';
import { setAlert, getAlertCount } from '../controllers/alertController.js';

const router = express.Router();

// Route to set user-configurable alert thresholds
router.post('/set-alert', setAlert);

// Route to fetch existing alerts (optional)
router.get('/counts/:city', getAlertCount);

export default router;
