import mongoose from 'mongoose'

const weatherDataSchema = new mongoose.Schema({
  city: { type: String, required: true },
  temp: { type: Number, required: true },
  feels_like: { type: Number, required: true },
  weather: { type: String, required: true },
  date: { type: Date, default: Date.now }
});
export default mongoose.model('WeatherData', weatherDataSchema);
