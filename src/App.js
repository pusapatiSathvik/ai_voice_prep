
import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignIn from './Auth/SignIn';
import SignUp from './Auth/SignUp';
import Home from './root/Home';
import InterviewsFetch from './root/InterviewsFetch';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
// import ProtectedRoute from './components/ProtectedRoute';
import Page from './interview/Page';
import Interview from './interview/Interview';
import QuestionsPage from './interview/Questions';
// import Start from './interview/Start';
// import VoiceCheck from './interview/VoiceCheck';
import FeedbackDetails from './interview/FeedbackDetails';
import SearchFeedbackById from './interview/SearchFeedbackById';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
function App() {
  return (
    <Router>
      {/* {isAuthenticated && <AppNavbar onLogout = {handleLogout}/>} Conditionally render navbar */}
      <AuthProvider>
        {/* Wrap your routes with AuthProvider to make auth context available */}
        <Routes>
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          {/* Use PrivateRoute to protect routes that require authentication */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
          <Route
            path="/interviewIds"
            element={
              <PrivateRoute>
                <InterviewsFetch />
              </PrivateRoute>
            }
          />
          <Route
            path="/generate"
            element={
              <PrivateRoute>
                <Page />
              </PrivateRoute>
            }
          />
          <Route
            path="/interview"
            element={
              <PrivateRoute>
                <Interview />
              </PrivateRoute>
            }
          />
          <Route
            path="/interview/questions"
            element={
              <PrivateRoute>
                <QuestionsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/interview/:interviewId/feedback/:feedbackId"
            element={
              <PrivateRoute>
                <FeedbackDetails />
              </PrivateRoute>
            }
          />
          <Route
            path="/search-feedback"
            element={
              <PrivateRoute>
                <SearchFeedbackById />
              </PrivateRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
