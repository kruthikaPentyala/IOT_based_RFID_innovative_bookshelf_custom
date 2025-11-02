import React, { useState, useEffect } from "react";
import { database } from "../firebase";
import { ref, set, onValue, remove } from "firebase/database";

function Mapping() {
  const [bookName, setBookName] = useState("");
  const [minDuty, setMinDuty] = useState("");
  const [maxDuty, setMaxDuty] = useState("");
  const [mappings, setMappings] = useState({});

  // 🔹 Fetch all mappings on page load
  useEffect(() => {
    const mappingRef = ref(database, "book_mapping");
    onValue(mappingRef, (snapshot) => {
      const data = snapshot.val() || {};
      setMappings(data);
    });
  }, []);

  // 🔹 Add or update a mapping
  const handleAddMapping = () => {
    if (!bookName || !minDuty || !maxDuty) {
      alert("Please fill all fields");
      return;
    }

    const mappingRef = ref(database, "book_mapping/" + bookName);
    set(mappingRef, {
      min_duty: Number(minDuty),
      max_duty: Number(maxDuty),
    });

    setBookName("");
    setMinDuty("");
    setMaxDuty("");
  };

  // 🔹 Delete a mapping
  const handleDeleteMapping = (book) => {
    const mappingRef = ref(database, `book_mapping/${book}`);
    remove(mappingRef);
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
      <h2 style={{ marginBottom: "20px" }}>📚 Book–Duty Cycle Mapping</h2>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          marginBottom: "20px",
        }}
      >
        <input
          type="text"
          placeholder="Book Name"
          value={bookName}
          onChange={(e) => setBookName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Min Duty Cycle"
          value={minDuty}
          onChange={(e) => setMinDuty(e.target.value)}
        />
        <input
          type="number"
          placeholder="Max Duty Cycle"
          value={maxDuty}
          onChange={(e) => setMaxDuty(e.target.value)}
        />
        <button
          onClick={handleAddMapping}
          style={{
            background: "#007bff",
            color: "white",
            border: "none",
            padding: "10px",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          ➕ Add Mapping
        </button>
      </div>

      <table border="1" style={{ width: "100%", textAlign: "center" }}>
        <thead>
          <tr>
            <th>Book Name</th>
            <th>Min Duty</th>
            <th>Max Duty</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(mappings).map(([book, range]) => (
            <tr key={book}>
              <td>{book}</td>
              <td>{range.min_duty}</td>
              <td>{range.max_duty}</td>
              <td>
                <button
                  onClick={() => handleDeleteMapping(book)}
                  style={{
                    background: "red",
                    color: "white",
                    border: "none",
                    padding: "5px 10px",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  ❌ Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Mapping;
