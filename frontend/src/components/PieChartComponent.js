// components/PieChartComponent.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PieChart, Pie, Tooltip, Cell, Legend, ResponsiveContainer } from 'recharts';

function PieChartComponent({ month }) {
  const [data, setData] = useState([]);
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AA336A'];

  useEffect(() => {
    const fetchPieChartData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/pie-chart', {
          params: { month },
        });
        const chartData = Object.keys(response.data).map((key) => ({
          category: key,
          count: response.data[key],
        }));
        setData(chartData);
      } catch (error) {
        console.error('Error fetching pie chart data');
      }
    };
    fetchPieChartData();
  }, [month]);

  return (
    <div className="chart-wrapper">
      <h2>Category Distribution</h2>
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={data}
            dataKey="count"
            nameKey="category"
            cx="50%"
            cy="50%"
            outerRadius={120}
            label
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default PieChartComponent;