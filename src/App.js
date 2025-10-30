import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import Transactions from "./components/Transactions";
import CurrentPositions from "./components/CurrentPositions";
import AddMapping from "./pages/AddMapping";

function App() {
  return (
    <Router>
      <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
        <h1>📚 Library WPT Dashboard</h1>

        {/* ✅ Simple Navigation Bar */}
        <nav style={{ marginBottom: "20px" }}>
          <Link to="/" style={{ marginRight: "15px" }}>Transactions</Link>
          <Link to="/positions" style={{ marginRight: "15px" }}>Current Positions</Link>
          <Link to="/add-mapping">Add Mapping</Link>
        </nav>

        {/* ✅ Routes */}
        <Routes>
          <Route path="/" element={<Transactions />} />
          <Route path="/positions" element={<CurrentPositions />} />
          <Route path="/add-mapping" element={<AddMapping />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
