import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Onboard from './Pages/Landing/Onboard';
import WelcomePage from './Pages/Landing/WelcomePage';
import SignUpPage from './Pages/Authentication/SignUpPage';
import LogInPage from './Pages/Authentication/LogInPage';
import HomePage from './Pages/Home/HomePage';
import Gallery from './Pages/Home/Gallery';
import Favorite from './Pages/Home/Favorite';
import Profile from './Pages/Home/Profile';
import Password from './Common_Parts/Account/Password';
import Setting from './Common_Parts/Account/Setting';
import Details from './Common_Parts/Account/Details';
import New_Story from './Pages/Home/New_Story';
import ForgotPasswordPage from './Pages/Authentication/ForgotPasswordPage';
import Story_Display from "./Common_Parts/PDFs/Story_Display";
import PDFViewer from './Common_Parts/PDFs/PDFViewer';
<<<<<<< HEAD
import BiographiesMemories from './Common_Parts/Categories/Biographies_Memories';
import KidsFamily from './Common_Parts/Categories/Kids_Family';
import LiteratureFiction from './Common_Parts/Categories/Literature_Fiction';
import PersonalGrowth from './Common_Parts/Categories/Personal_Growth';
import Romance from './Common_Parts/Categories/Romance';
=======
>>>>>>> 46197457c9546c4070be63de12004d6eb700cc24


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Onboard />} />
        <Route path="/welcome" element={<WelcomePage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LogInPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/favorite" element={<Favorite />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/details" element={<Details />} />
        <Route path="/password" element={<Password />} />
        <Route path="/setting" element={<Setting />} />  
        <Route path="/new_story" element={<New_Story />} />
        <Route path="/display-story" element={<Story_Display />} /> {/* New route for Story_Display */}
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/pdf-viewer" element={<PDFViewer />} />
<<<<<<< HEAD
        <Route path="/Kids_Family" element={<KidsFamily />} />
        <Route path="/Biographies_Memories" element={<BiographiesMemories />} />
        <Route path="/Literature_Fiction" element={<LiteratureFiction />} />
        <Route path="/Personal_Growth" element={<PersonalGrowth />} />
        <Route path="/Romance" element={<Romance />} />
=======
>>>>>>> 46197457c9546c4070be63de12004d6eb700cc24
      </Routes>
    </Router>
  );
}

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);

export default App;
