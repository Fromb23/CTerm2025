import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Checker from './pages/Checker';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Checker />} />
      </Routes>
    </Router>
  );
}

export default App;
