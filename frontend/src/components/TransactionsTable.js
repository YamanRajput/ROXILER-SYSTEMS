// components/TransactionsTable.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function TransactionsTable({ month }) {
  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const perPage = 10;

  useEffect(() => {
    fetchTransactions();
  }, [month, search, page]);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/transactions', {
        params: {
          month,
          search,
          page,
          perPage,
        },
      });
      setTransactions(response.data);
    } catch (error) {
      console.error('Error fetching transactions');
    }
  };

  return (
    <div className="transactions-table">
      <h2>Transactions</h2>
      <input
        type="text"
        className="search-box"
        placeholder="Search by title, description, or price..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
      />
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th>Sold</th>
            <th>Date of Sale</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((txn) => (
            <tr key={txn.id}>
              <td>{txn.title}</td>
              <td>${txn.price.toFixed(2)}</td>
              <td>{txn.sold ? 'Yes' : 'No'}</td>
              <td>{new Date(txn.dateOfSale).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
        >
          Previous
        </button>
        <span>Page {page}</span>
        <button onClick={() => setPage((prev) => prev + 1)}>
          Next
        </button>
      </div>
    </div>
  );
}

export default TransactionsTable;