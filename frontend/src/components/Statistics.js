// components/Statistics.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Statistics({ month }) {
  const [stats, setStats] = useState({
    totalSaleAmount: 0,
    totalSoldItems: 0,
    totalNotSoldItems: 0,
  });

  useEffect(() => {
    fetchStatistics();
  }, [month]);

  const fetchStatistics = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/statistics', {
        params: { month },
      });
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching statistics');
    }
  };

  return (
    <div className="stats-container">
      <div className="stat-card">
        <h3>Total Sale Amount</h3>
        <p>${stats.totalSaleAmount.toFixed(2)}</p>
      </div>
      <div className="stat-card">
        <h3>Total Sold Items</h3>
        <p>{stats.totalSoldItems}</p>
      </div>
      <div className="stat-card">
        <h3>Total Not Sold Items</h3>
        <p>{stats.totalNotSoldItems}</p>
      </div>
    </div>
  );
}

export default Statistics;