// App.js
import React, { useState } from 'react';
import TransactionsTable from './components/TransactionsTable';
import Statistics from './components/Statistics';
import BarChartComponent from './components/BarChartComponent';
import PieChartComponent from './components/PieChartComponent';
import './App.css';

function App() {
  const [month, setMonth] = useState('March');

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  return (
    <div className="App">
      <h1>Transactions Dashboard</h1>
      <div className="month-selector">
        <label>Select Month: </label>
        <select value={month} onChange={(e) => setMonth(e.target.value)}>
          {months.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </div>
      <Statistics month={month} />
      <div className="charts-container">
        <BarChartComponent month={month} />
        <PieChartComponent month={month} />
      </div>
      <TransactionsTable month={month} />
    </div>
  );
}

export default App;