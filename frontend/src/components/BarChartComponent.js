// components/BarChartComponent.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function BarChartComponent({ month }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchBarChartData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/bar-chart', {
          params: { month },
        });
        const chartData = Object.keys(response.data).map((key) => ({
          priceRange: key,
          count: response.data[key],
        }));
        setData(chartData);
      } catch (error) {
        console.error('Error fetching bar chart data');
      }
    };
    fetchBarChartData();
  }, [month]);

  return (
    <div className="chart-wrapper">
      <h2>Price Range Distribution</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="priceRange" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" fill="#3498db" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default BarChartComponent;