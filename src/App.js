
// import React from 'react';
// import './App.css';
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import SignIn from './Auth/SignIn';
// import SignUp from './Auth/SignUp';
// import Home from './root/Home';
// import InterviewsFetch from './root/InterviewsFetch';
// import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
// import Page from './interview/Page';
// import Interview from './interview/Interview';
// import QuestionsPage from './interview/Questions';
// import YourInterviews from './root/YourInterviews';
// import FeedbackDetails from './interview/FeedbackDetails';
// import SearchFeedbackById from './interview/SearchFeedbackById';
// import { AuthProvider } from './contexts/AuthContext';
// import PrivateRoute from './components/PrivateRoute';

// function App() {
//   return (
//     <Router>
//       <AuthProvider>
//         {/* Wrap your routes with AuthProvider to make auth context available */}
//         <Routes>
//           <Route path="/sign-in" element={<SignIn />} />
//           <Route path="/sign-up" element={<SignUp />} />
//           {/* Use PrivateRoute to protect routes that require authentication */}
//           <Route
//             path="/"
//             element={
//               <PrivateRoute>
//                 <Home />
//               </PrivateRoute>
//             }
//           />
//           <Route
//             path="/yourInterviews"
//             element={
//               <PrivateRoute>
//                 <YourInterviews />
//               </PrivateRoute>
//             }
//           />
//           <Route
//             path="/interviewIds"
//             element={
//               <PrivateRoute>
//                 <InterviewsFetch />
//               </PrivateRoute>
//             }
//           />
//           <Route
//             path="/generate"
//             element={
//               <PrivateRoute>
//                 <Page />
//               </PrivateRoute>
//             }
//           />
//           <Route
//             path="/interview"
//             element={
//               <PrivateRoute>
//                 <Interview />
//               </PrivateRoute>
//             }
//           />
//           <Route
//             path="/interview/questions"
//             element={
//               <PrivateRoute>
//                 <QuestionsPage />
//               </PrivateRoute>
//             }
//           />
//           <Route
//             path="/interview/:interviewId/feedback/:feedbackId"
//             element={
//               <PrivateRoute>
//                 <FeedbackDetails />
//               </PrivateRoute>
//             }
//           />
//           <Route
//             path="/search-feedback"
//             element={
//               <PrivateRoute>
//                 <SearchFeedbackById />
//               </PrivateRoute>
//             }
//           />
//         </Routes>
//       </AuthProvider>
//     </Router>
//   );
// }

// export default App;






import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom'; // Import useLocation
import SignIn from './Auth/SignIn';
import SignUp from './Auth/SignUp';
import Home from './root/Home';
import InterviewsFetch from './root/InterviewsFetch';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import Page from './interview/Page';
import Interview from './interview/Interview';
import QuestionsPage from './interview/Questions';
import YourInterviews from './root/YourInterviews';
import FeedbackDetails from './interview/FeedbackDetails';
import SearchFeedbackById from './interview/SearchFeedbackById';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar'; // Import Navbar here

function AppContent() { // Renamed App to AppContent to use useLocation
  const location = useLocation(); // Get the current location object

  // Define paths where the Navbar should NOT be shown
  const noNavbarPaths = ['/sign-in', '/sign-up'];
  const showNavbar = !noNavbarPaths.includes(location.pathname);

  return (
    <>
      {showNavbar && <Navbar />} {/* Conditionally render Navbar */}
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
          path="/yourInterviews"
          element={
            <PrivateRoute>
              <YourInterviews />
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
    </>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent /> {/* Render the new AppContent component */}
      </AuthProvider>
    </Router>
  );
}

export default App;
