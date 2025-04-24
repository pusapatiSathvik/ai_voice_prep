
import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignIn from './Auth/SignIn';
import SignUp from './Auth/SignUp';
import Home from './root/Home';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import ProtectedRoute from './components/ProtectedRoute';
import Page from './interview/Page';
import Interview from './interview/Interview';
import QuestionsPage from './interview/Questions';
// import Start from './interview/Start';
// import VoiceCheck from './interview/VoiceCheck';
import FeedbackDetails from './interview/FeedbackDetails';
import SearchFeedbackById from './interview/SearchFeedbackById';
function App() {
  return (
    <Router>
      {/* {isAuthenticated && <AppNavbar onLogout = {handleLogout}/>} Conditionally render navbar */}
      <Routes>
        <Route path="/sign-in" element={<SignIn/>} />
        <Route path="/sign-up" element={<SignUp/>} />
        <Route element={<ProtectedRoute/>}>
          <Route path="/" element={<Home />} />
          <Route path="/generate" element={<Page/>} />
          <Route path="/interview" element={<Interview/>} />
          <Route path="/interview/questions" element={<QuestionsPage />} />
          <Route path="/interview/:interviewId/feedback/:feedbackId" element={<FeedbackDetails />} />
          <Route path="/search-feedback" element={<SearchFeedbackById />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;