// backend/controllers/weatherController.js
import WeatherSummary from '../models/weatherSummary.js';
import axios from 'axios';
import WeatherData from '../models/weatherData.js';
const cities = ['Delhi', 'Mumbai', 'Chennai', 'Bangalore', 'Kolkata', 'Hyderabad'];
// Get daily weather summary from the database
export const getSummary = async (req, res) => {
  try {
    const city = req.params.city;

    // Get the current date and calculate the date seven days ago
    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 7);

    // Find summaries for the last 7 days for the given city
    const summaries = await WeatherSummary.find({
      city: city,
      date: {
        $gte: sevenDaysAgo,  // Greater than or equal to seven days ago
        $lte: today          // Less than or equal to today
      }
    }).sort({ date: -1 });  // Sort by date in descending order (most recent first)

    // Return the summaries
    res.json(summaries);
  } catch (error) {
    console.error('Error fetching daily summaries:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const fetchWeatherData = async () => {
  try {
    for (const city of cities) {
      const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.API_KEY}`);
      const data = response.data;

      const weatherRecord = new WeatherData({
        city: data.name,
        temp: (data.main.temp - 273.15).toFixed(2),
        feels_like: (data.main.feels_like - 273.15).toFixed(2),
        weather: data.weather[0].main,
        dt: data.dt
      });

      await weatherRecord.save();
      console.log(`Weather data saved for ${city}`);
    }
  } catch (error) {
    console.error('Error fetching weather data:', error);
  }
};
