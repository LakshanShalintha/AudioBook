import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Onboard from './Pages/Landing/Onboard';
import WelcomePage from './Pages/Landing/WelcomePage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Onboard />} />
        <Route path="/welcome" element={<WelcomePage />} />
      </Routes>
    </Router>
  );
}

export default App;
