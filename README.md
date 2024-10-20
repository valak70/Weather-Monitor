# Real-Time Data Processing System for Weather Monitoring with Rollups and Aggregates

## Objective
This project aims to develop a real-time data processing system that monitors weather conditions and provides summarized insights using rollups and aggregates. The system continuously retrieves data from the OpenWeatherMap API and processes it for metros in India. It calculates daily summaries and triggers alerts based on user-defined thresholds.

## Data Source
The system fetches real-time weather data from the [OpenWeatherMap API](https://openweathermap.org/). You will need an API key to access the data. The relevant weather parameters used in this system are:
- **main**: Main weather condition (e.g., Rain, Snow, Clear)
- **temp**: Current temperature in Celsius
- **feels_like**: Perceived temperature in Celsius
- **dt**: Time of data update (Unix timestamp)



## Installation

### Prerequisites
- Node.js (>=14.x)
- MongoDB Atlas account for database connection

### Setup Instructions

#### Clone the Repository
```bash
git clone https://github.com/valak70/Weather-Monitor
cd Weather-Monitor 
```
#### Install Dependencies
You'll need to install dependencies for both the api and client folders:
- For the API:
``` bash
cd api
npm install
```
- For the Client:
``` bash
cd ../client
npm install
```
#### Set Up Environment Variables
- API Environment Setup:
``` bash
MONGO=<your-mongodb-atlas-url>
PORT=5000
API_KEY=<WeatherAPI-app_key>
```
- Client Environment Setup:
``` bash 
VITE_BACKEND_URL=https://localhost:5000
```
### Run the Application
- Start the API server:
``` bash
cd api
npm start
```
- Start the client:
```bash
cd ../client
npm run dev
```

## Key Features

### 1. Real-Time Weather Monitoring
- The system retrieves weather data at configurable intervals (e.g., every 5 minutes) for metro cities in India: Delhi, Mumbai, Chennai, Bangalore, Kolkata, Hyderabad.
- It automatically converts temperature values from Kelvin to Celsius for easier user interpretation.

### 2. Rollups and Aggregates

#### Daily Weather Summary
- **Rolls up weather data daily**: For each city, the system calculates and stores daily weather summaries.
- **Aggregates calculated include**:
  - **Average temperature**
  - **Maximum temperature**
  - **Minimum temperature**
  - **Dominant weather condition** (decided using Information Theory principles, explained below)

#### Role of Information Theory:
  We leverage **Information Theory** to measure the uncertainty or entropy of the weather conditions for a day. The idea is that:

- Weather conditions that occur less frequently carry more information (because they are less expected).
- Common conditions, such as "Clouds" or "Mist," carry less information because they are more likely to occur.

We balance frequency and information content to calculate the dominant weather condition.

#### Why Use This Approach?
This method ensures that we account for both common conditions (e.g., "Clouds" happening frequently) and rare conditions (e.g., "Thunderstorm" being rare but significant). The combination of frequency and information theory allows us to make a more intelligent decision about which condition should be considered dominant, rather than simply picking the most frequent condition.


The dominant weather condition is calculated using the following function:

```javascript
function calculateDominantWeather(data) {
    const weatherCounts = data.reduce((counts, item) => {
        counts[item.weather] = (counts[item.weather] || 0) + 1;
        return counts;
    }, {});

    const totalWeatherCount = data.length;
    const weatherProbabilities = {};
    for (const weather in weatherCounts) {
        weatherProbabilities[weather] = weatherCounts[weather] / totalWeatherCount;
    }

    const weatherInformation = {};
    for (const weather in weatherProbabilities) {
        weatherInformation[weather] = -Math.log(weatherProbabilities[weather]);
    }

    const weatherScores = {};
    for (const weather in weatherCounts) {
        weatherScores[weather] = weatherCounts[weather] * weatherInformation[weather];
    }

    const dominantWeather = Object.keys(weatherScores).reduce((a, b) => 
        weatherScores[a] > weatherScores[b] ? a : b
    );

    return dominantWeather;
}
```
### 3. Alerting System

#### Configurable Thresholds
- Users can set **custom thresholds** for weather conditions (e.g. city: Mumbai, temperature > 35°C for two consecutive updates).
- The system continuously monitors the latest weather data and compares it against these thresholds.

#### Alert Triggers
- If thresholds are breached, **alerts are logged to the console** (future plans include sending email notifications).
- For each city, the system tracks the **number of triggered alerts** and displays a summary of alerts over a **7-day window**.


### 4. Visualizations 
- **Daily weather summaries** and historical trends are visualized.
- **Alerts** will be shown in a clear and concise manner, with trends over time displayed graphically.
