import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cron from 'cron'
import cors from 'cors'
import { fetchWeatherData } from './controllers/weatherController.js';
import { checkAlerts } from './controllers/alertController.js';
import weatherRoutes from './routes/weatherRoute.js'
import alertRoutes from './routes/alertRoute.js'
import { rollUpDailyWeather } from './rollup.js';

dotenv.config();
const app = express();
app.use(express.json());

const connect = async () => {
    try {
      await mongoose.connect(process.env.MONGO);
      console.log("Connected to mongoDB");
    } catch (error) {
      console.log(error.message);
    }
  }

  app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allow all necessary methods
    credentials: true, // Allow credentials (cookies) to be sent and received
  }));
  app.use('/api/weather', weatherRoutes);
  app.use('/api/alerts', alertRoutes);


app.listen(process.env.PORT, async() => {
    await connect()
    console.log(`Server running on port ${process.env.PORT}`)
})


const job = new cron.CronJob('*/5 * * * *', () => {
  fetchWeatherData();
  checkAlerts();
});
job.start();

const rollUpJob = new cron.CronJob('0 0 * * *', async () => {
  await rollUpDailyWeather()
});
rollUpJob.start();