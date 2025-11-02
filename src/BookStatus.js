import React, { useEffect, useState } from "react";
import { database } from "./firebase";
import { ref, onValue } from "firebase/database";

function BookStatus() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    // Listen for book status updates
    const statusRef = ref(database, "book_status");
    onValue(statusRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const arr = Object.values(data);
        setBooks(arr.reverse());
      }
    });
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>📚 Real-Time Book Status</h2>
      <table border="1" style={{ width: "100%", textAlign: "center" }}>
        <thead>
          <tr>
            <th>Book Name</th>
            <th>Position</th>
            <th>Status</th>
            <th>Duty Cycle</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {books.map((b, index) => (
            <tr key={index}>
              <td>{b.book_name || "Unknown Book"}</td>
              <td>{b.position || "-"}</td>
              <td style={{ color: b.status === "placed" ? "green" : "red" }}>
                {b.status === "placed" ? "Present" : "Removed"}
              </td>
              <td>{b.duty_cycle}</td>
              <td>{b.timestamp}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default BookStatus;
