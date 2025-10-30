import React, { useState, useEffect } from "react";
import { database } from "../firebase";
import { ref, set, remove, onValue } from "firebase/database";

function AddMapping() {
  const [tagId, setTagId] = useState("");
  const [bookName, setBookName] = useState("");
  const [tagMappings, setTagMappings] = useState({});

  // Load existing mappings from Firebase
  useEffect(() => {
    const tagRef = ref(database, 'tag_mapping');
    onValue(tagRef, (snapshot) => {
      const data = snapshot.val() || {};
      setTagMappings(data);
    });
  }, []);

  // Add / Update a mapping
  const handleAdd = () => {
    if (!tagId || !bookName) return alert("Both fields are required!");
    set(ref(database, `tag_mapping/${tagId}`), { book_name: bookName });
    setTagId("");
    setBookName("");
  };

  // Delete a mapping
  const handleDelete = (id) => {
    if (window.confirm(`Are you sure you want to delete mapping for ${id}?`)) {
      remove(ref(database, `tag_mapping/${id}`));
    }
  };

  return (
    <div>
      <h2>Map Tag to Book</h2>
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Tag ID"
          value={tagId}
          onChange={(e) => setTagId(e.target.value)}
          style={{ marginRight: "10px" }}
        />
        <input
          type="text"
          placeholder="Book Name"
          value={bookName}
          onChange={(e) => setBookName(e.target.value)}
          style={{ marginRight: "10px" }}
        />
        <button onClick={handleAdd}>Add / Update</button>
      </div>

      <h3>Existing Mappings</h3>
      <table border="1" style={{ width: "50%", textAlign: "center" }}>
        <thead>
          <tr>
            <th>Tag ID</th>
            <th>Book Name</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(tagMappings).map(([id, data]) => (
            <tr key={id}>
              <td>{id}</td>
              <td>{data.book_name}</td>
              <td>
                <button onClick={() => handleDelete(id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AddMapping;
