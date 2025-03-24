
import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignIn from './Auth/SignIn';
import SignUp from './Auth/SignUp';
import Home from './root/Home';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

function App() {
  return (
    <Router>
      {/* {isAuthenticated && <AppNavbar onLogout = {handleLogout}/>} Conditionally render navbar */}
      <Routes>
        <Route path="/sign-in" element={<SignIn/>} />
        <Route path="/sign-up" element={<SignUp/>} />
        <Route path="/" element={<Home/>} />
        {/* {isAuthenticated && (
          <>
            <Route path="/" element={<Home/>} />

            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/logout" element={<Logout onLogout = {handleLogout} />} />
          </>
        )} */}
      </Routes>
    </Router>
  );
}

export default App;