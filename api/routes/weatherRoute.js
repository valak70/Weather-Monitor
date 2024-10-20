// backend/routes/weatherRoutes.js
import express from 'express';
import { getSummary, fetchWeatherData } from '../controllers/weatherController.js';

const router = express.Router();

// Route to get daily weather summary
router.get('/summary/:city', getSummary);

// Route to fetch weather data from OpenWeatherMap (optional, if you need a manual trigger)
router.get('/fetch-weather', fetchWeatherData);

export default router;
