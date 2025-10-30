import React, { useEffect, useState } from "react";
import { database } from "../firebase";
import { ref, onValue } from "firebase/database";
import tagToBook from "../tagMapping";

function Transactions() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const transactionsRef = ref(database, 'transactions');
    onValue(transactionsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const arr = Object.values(data);
        setTransactions(arr);
      }
    });
  }, []);

  return (
    <div>
      <h2>Book Transactions</h2>
      <table border="1" style={{ width: "100%", textAlign: "center", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Tag ID</th>
            <th>Book Name</th>
            <th>To Position</th>
            <th>Timestamp</th>
            <th>Transaction ID</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((txn, index) => (
            <tr key={index}>
              <td>{txn.tag_id}</td>
              <td>{tagToBook[txn.tag_id] || "Unknown Book"}</td>
              <td>{txn.to_position}</td>
              <td>{txn.timestamp}</td>
              <td>{txn.txn_id}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Transactions;
