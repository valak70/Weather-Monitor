import mongoose from 'mongoose';

const weatherSummarySchema = new mongoose.Schema({
  city: { type: String, required: true }, // Store the city name
  date: { type: Date, required: true }, // Store the date for the summary
  avgTemp: { type: Number, required: true },
  maxTemp: { type: Number, required: true },
  minTemp: { type: Number, required: true },
  dominantCondition: { type: String, required: true }, // e.g., Rain, Clear, etc.
});

export default mongoose.model('WeatherSummary', weatherSummarySchema);
