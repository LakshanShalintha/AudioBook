import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Onboard from './Pages/Landing/Onboard';
import WelcomePage from './Pages/Landing/WelcomePage';
import SignUpPage from './Pages/Authentication/SignUpPage';
import LogInPage from './Pages/Authentication/LogInPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Onboard />} />
        <Route path="/welcome" element={<WelcomePage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LogInPage />} />
      </Routes>
    </Router>
  );
}

export default App;
