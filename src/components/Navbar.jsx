import React from 'react';
import '../App.css'; // Ensure App.css is imported for custom styles
import { auth } from '../Firebase/client';
import { signOut } from 'firebase/auth';
import { useNavigate, NavLink } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log('User signed out');
      navigate('/sign-in');
    } catch (error) {
      console.error('Sign-out error:', error);
    }
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg bg-dark border-bottom border-body fixed-top" data-bs-theme="dark">
        <div className="container-fluid">
          <span className="navbar-brand">
            HireView
          </span>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          {/* Added flex-grow-1 to make this div take up available space
              and justify-content-between to push items to ends if needed,
              though for centering, we'll apply justify-content-center to the ul. */}
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            {/* Removed 'me-auto' and added 'justify-content-center' to center the nav items.
                'flex-grow-1' on the ul ensures it takes up available space to be centered within. */}
            <ul className="navbar-nav justify-content-center flex-grow-1 mb-2 mb-lg-0">
              <li className="nav-item">
                <NavLink className="nav-link" to="/" end>
                  Home
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/yourInterviews">
                  Interviews
                </NavLink>
              </li>
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="/"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Dropdown
                </a>
                <ul className="dropdown-menu">
                  <li>
                    <a className="dropdown-item" href="/action">
                      Action
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="/another-action">
                      Another action
                    </a>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <a className="dropdown-item" href="/something-else">
                      Something else here
                    </a>
                  </li>
                </ul>
              </li>
              <li className="nav-item">
                <span className="nav-link disabled" aria-disabled="true">
                  Disabled
                </span>
              </li>
            </ul>
            {/* The logout button will naturally align to the right due to the flex-grow-1 on the ul */}
            <button className="btn btn-outline-danger" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
