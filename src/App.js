import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import BookStatus from "./BookStatus";
import Mapping from "./components/Mapping";

function App() {
  return (
    <Router>
      <div style={{ padding: "20px" }}>
        <h1>📖 Library Dashboard</h1>
        <nav style={{ marginBottom: "20px" }}>
          <Link to="/" style={{ marginRight: "10px" }}>Book Status</Link>
          <Link to="/mapping">Mapping</Link>
        </nav>

        <Routes>
          <Route path="/" element={<BookStatus />} />
          <Route path="/mapping" element={<Mapping />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
