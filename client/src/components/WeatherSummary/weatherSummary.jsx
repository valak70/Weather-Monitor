import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import './weatherSummary.css';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Link } from 'react-router-dom';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const WeatherSummary = () => {
  const [city, setCity] = useState('Mumbai');
  const [summary, setSummary] = useState([]);
  const [chartData, setChartData] = useState(null);
  const [alertCountData, setAlertCountData] = useState(null);  // New state for alert count data

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/weather/summary/${city}`);
        const data = response.data;
        setSummary(data);
        console.log(summary);
        
        const labels = data.map(entry => new Date(entry.date).toLocaleDateString());
        const avgTempData = data.map(entry => entry.avgTemp);
        const maxTempData = data.map(entry => entry.maxTemp);
        const minTempData = data.map(entry => entry.minTemp);

        setChartData({
          labels,
          datasets: [
            {
              label: 'Average Temperature',
              data: avgTempData,
              borderColor: 'rgba(75,192,192,1)',
              fill: false,
            },
            {
              label: 'Max Temperature',
              data: maxTempData,
              borderColor: 'rgba(255,99,132,1)',
              fill: false,
            },
            {
              label: 'Min Temperature',
              data: minTempData,
              borderColor: 'rgba(54,162,235,1)',
              fill: false,
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching weather summary:', error);
      }
    };

    const fetchAlertCounts = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/alerts/counts/${city}`);
        const data = response.data;
        const labels = data.map(entry => new Date(entry.date).toLocaleDateString());
        const counts = data.map(entry => entry.count);
        
        setAlertCountData({
          labels,
          datasets: [
            {
              label: 'Triggered Alerts',
              data: counts,
              borderColor: 'rgba(255,206,86,1)',
              fill: false,
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching alert counts:', error);
      }
    };

    fetchSummary();
    fetchAlertCounts();
  }, [city]);

  return (
      <div className="weather-summary-container">
      <h2>Weather Summary for {city}</h2>

      <select onChange={(e) => setCity(e.target.value)} value={city}>
        <option value="Delhi">Delhi</option>
        <option value="Mumbai">Mumbai</option>
        <option value="Chennai">Chennai</option>
        <option value="Bengaluru">Bengaluru</option>
        <option value="Kolkata">Kolkata</option>
        <option value="Hyderabad">Hyderabad</option>
      </select>

      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} >
      {chartData ? (
        <div className="chart-container">
          <Line data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
        </div>
      ) : (
        <p className="loading">Loading weather summary...</p>
      )}

      {alertCountData ? (
        <div className="chart-container">
          <Line data={alertCountData} options={{ responsive: true, maintainAspectRatio: false }} />
        </div>
      ) : (
        <p className="loading">Loading alert count data...</p>
      )}
      </div>

      {summary && summary.length > 0 ? (
        <div className="weather-data">
          <p><strong>Most Recent Data:</strong></p>
          <p>Average Temp: {summary[0].avgTemp}°C</p>
          <p>Max Temp: {summary[0].maxTemp}°C</p>
          <p>Min Temp: {summary[0].minTemp}°C</p>
          <p>Dominant Condition: {summary[0].dominantCondition}</p>
        </div>
      ) : (
        <p>No summary available for this city yet.</p>
      )}
      <Link to="/alert">
      <button className="redirect-button">Set an Alert</button>
    </Link>
    </div>
  );
};

export default WeatherSummary;
