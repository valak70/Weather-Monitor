// backend/controllers/alertController.js

import Weather from '../models/weatherData.js';
import Alert from '../models/alert.js';
import AlertCount from '../models/alertCount.js';
// Set a new alert threshold
export const setAlert = async (req, res) => {
  const { city, temperature, email, consecutiveTimes } = req.body;

  try {
    const newAlert = new Alert({
      city,
      temperature,
      email,
      consecutiveTimes
    });

    await newAlert.save();
    res.status(201).send({ message: 'Alert set successfully', alert: newAlert });
  } catch (error) {
    console.error('Error saving alert:', error);
    res.status(500).send({ message: 'Error setting alert' });
  }
};



export const checkAlerts = async () => {
  const alerts = await Alert.find();
  let today = new Date().toISOString().split('T')[0];
  for (const alert of alerts) {
    // Fetch the most recent weather data entries for the city
    const recentWeatherData = await Weather.find({ city: alert.city }).sort({ dt: -1 }).limit(alert.consecutiveTimes);

    // Initialize a counter for consecutive threshold breaches
    let consecutiveBreaches = 0;

    // Iterate over the recent weather data to count consecutive breaches
    for (const weather of recentWeatherData) {
      if (
        (alert.temperature.condition === 'greater' && weather.temp > alert.temperature.value) ||
        (alert.temperature.condition === 'less' && weather.temp < alert.temperature.value)
      ) {
        consecutiveBreaches++;
      } else {
        // If a condition is not met, reset the counter and break the loop
        consecutiveBreaches = 0;
        break;
      }
    }

    // If the number of consecutive breaches matches the required consecutiveTimes, log the alert
    if (consecutiveBreaches === alert.consecutiveTimes) {
      // Log the alert if it's the first time or more than 1 hour has passed since the last alert
      if (!alert.lastAlertSent || (Date.now() - alert.lastAlertSent) > 3600000) {
        console.log(`ALERT: The temperature in ${alert.city} has breached the threshold for ${alert.consecutiveTimes} consecutive times.`);
        console.log(`Condition: ${alert.temperature.condition} than ${alert.temperature.value}°C.`);
        console.log(`Current temperature: ${recentWeatherData[0].temp}°C.`);
        console.log(`Alert for: ${alert.email}`);

        alert.lastAlertSent = Date.now();
        await alert.save();
      }
      try {
        // Use findOne to check for an existing document for this city and date
        let alertCount = await AlertCount.findOne({ date: today, city: alert.city });
      
        if (!alertCount) {
          // If no record exists, create a new entry
          alertCount = new AlertCount({ date: today, city: alert.city, count: 1 });
        } else {
          // If a record exists, increment the count
          alertCount.count += 1;
        }
      
        // Save the alert count (either new or updated)
        await alertCount.save();
      } catch (error) {
        console.error('Error updating alert count:', error);
      }
    }
  }
};

export const getAlertCount = async (req, res) => {
  try {
    const city = req.params.city;

    // Get the current date and calculate the date seven days ago
    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 7);

    // Find alert counts for the last 7 days for the given city
    const alertCounts = await AlertCount.find({
      city: city,
      date: {
        $gte: sevenDaysAgo,  // Greater than or equal to seven days ago
        $lte: today           // Less than or equal to today
      }
    }).sort({ date: -1 });  // Sort by date in descending order (most recent first)

    // Return the alert counts
    res.json(alertCounts);
  } catch (error) {
    console.error('Error fetching alert counts:', error);
    res.status(500).json({ message: 'Server error' });
  }
};