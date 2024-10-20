import cron from 'node-cron';
import WeatherData from './models/weatherData.js';
import WeatherSummary from './models/weatherSummary.js';

// Function to roll up the weather data for a given target day (defaults to current day)
export const rollUpDailyWeather = async (targetDate = new Date()) => {
  // Set the targetDate to the start of the day
  const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
  const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));

  console.log(`Rolling up weather data for: ${startOfDay.toISOString()}`);

  // Fetch weather data for the target day
  const weatherData = await WeatherData.aggregate([
    {
      $match: {
        date: {
          $gte: startOfDay,  // Start of the target day
          $lt: endOfDay  // End of the target day
        }
      }
    },
    {
      $group: {
        _id: "$city",  // Group by city
        data: { $push: "$$ROOT" }  // Collect all data entries for the city
      }
    }
  ]);

  if (weatherData.length === 0) {
    console.log('No weather data found for the target date.');
    return;
  }

  // Perform the aggregation and save summaries for each city
  for (const cityGroup of weatherData) {
    const city = cityGroup._id;
    const data = cityGroup.data;

    // Calculate aggregates for the city
    const avgTemp = data.reduce((sum, entry) => sum + entry.temp, 0) / data.length;
    const maxTemp = Math.max(...data.map(entry => entry.temp));
    const minTemp = Math.min(...data.map(entry => entry.temp));
    const dominantCondition = calculateDominantWeather(data); // Implement this function

    // Store the rolled-up summary for the city
    const summary = new WeatherSummary({
      city,
      date: startOfDay,  // Store the start of the day as the summary date
      avgTemp,
      maxTemp,
      minTemp,
      dominantCondition
    });

    await summary.save();
  }

  console.log('Weather summary stored successfully.');
};



// Example function to calculate the dominant weather condition
function calculateDominantWeather(data) {
  // Count the frequency of each weather type
  const weatherCounts = data.reduce((counts, item) => {
      counts[item.weather] = (counts[item.weather] || 0) + 1;
      return counts;
  }, {});

  // Total number of weather data points
  const totalWeatherCount = data.length;

  // Calculate probabilities of each weather type
  const weatherProbabilities = {};
  for (const weather in weatherCounts) {
      weatherProbabilities[weather] = weatherCounts[weather] / totalWeatherCount;
  }

  // Calculate information content for each weather type (-log(probability))
  const weatherInformation = {};
  for (const weather in weatherProbabilities) {
      weatherInformation[weather] = -Math.log(weatherProbabilities[weather]);
  }

  // Multiply frequency by information content to get the overall score for each weather type
  const weatherScores = {};
  for (const weather in weatherCounts) {
      weatherScores[weather] = weatherCounts[weather] * weatherInformation[weather];
  }

  // Find the weather type with the highest score
  const dominantWeather = Object.keys(weatherScores).reduce((a, b) => 
      weatherScores[a] > weatherScores[b] ? a : b
  );

  return dominantWeather;
}
