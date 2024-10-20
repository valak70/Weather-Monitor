import React, { useState } from 'react';
import axios from 'axios';
import './alert.css'; // Import the CSS for the form

const AlertForm = () => {
  const [city, setCity] = useState('');
  const [temperature, setTemperature] = useState('');
  const [email, setEmail] = useState('');
  const [consecutiveTimes, setConsecutiveTimes] = useState('');
  const [condition, setCondition] = useState('greater');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const alertData = {
      city,
      temperature: {
        value: temperature,
        condition
      },
      email,
      consecutiveTimes
    };

    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/alerts/set-alert`, alertData);
      alert('Alert set successfully!');
    } catch (error) {
      console.error('Error setting alert', error);
      alert('Error setting alert');
    }
  };

  return (
    <div className="form-container">
      <h2>Set Weather Alert</h2>
      <form onSubmit={handleSubmit} className="alert-form">
        <div className="form-group">
          <label>City: </label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Temperature: </label>
          <input
            type="number"
            value={temperature}
            onChange={(e) => setTemperature(e.target.value)}
            required
          />
          <select value={condition} onChange={(e) => setCondition(e.target.value)}>
            <option value="greater">Greater than</option>
            <option value="less">Less than</option>
          </select>
        </div>

        

        <div className="form-group">
          <label>Consecutive Times: </label>
          <input
            type="number"
            value={consecutiveTimes}
            onChange={(e) => setConsecutiveTimes(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Email: </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="submit-button">Set Alert</button>
      </form>
    </div>
  );
};

export default AlertForm;
