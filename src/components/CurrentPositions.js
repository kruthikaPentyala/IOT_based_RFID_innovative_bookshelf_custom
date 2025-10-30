import React, { useEffect, useState } from "react";
import { database } from "../firebase";
import { ref, onValue } from "firebase/database";

function CurrentPositions() {
  const [positions, setPositions] = useState({});

  useEffect(() => {
    const positionsRef = ref(database, 'currentPositions');
    onValue(positionsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) setPositions(data);
    });
  }, []);

  return (
    <div>
      <h2>Current Positions</h2>
      <table border="1" style={{width: "100%", textAlign: "center"}}>
        <thead>
          <tr>
            <th>Tag ID</th>
            <th>Current Shelf</th>
            <th>Last Seen</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(positions).map(([tag, info]) => (
            <tr key={tag}>
              <td>{tag}</td>
              <td>{info.position_id}</td>
              <td>{info.lastSeen}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CurrentPositions;
