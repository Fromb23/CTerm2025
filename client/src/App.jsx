import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Checker from './pages/Checker';
import CheckerResult from './pages/CheckerResult';
import CheckerSubmission from './pages/CheckerSubmission';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Checker />} />
        <Route path="/result" element={<CheckerResult />} />
        <Route path="/checker-submission" element={<CheckerSubmission />} />
        
      </Routes>
    </Router>
  );
}

export default App;
