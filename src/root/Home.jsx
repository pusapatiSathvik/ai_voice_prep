import React, { useRef, useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHtml5, faCss3Alt } from '@fortawesome/free-brands-svg-icons';
import { faLaptopCode } from '@fortawesome/free-solid-svg-icons';

const Home = () => {
  const navbarRef = useRef(null);
  const [marginTop, setMarginTop] = useState('80px');

  useEffect(() => {
    if (navbarRef.current) {
      setMarginTop(`${navbarRef.current.offsetHeight}px`);
    }
  }, []);

  // Interview data array
  const interviews = [
    {
      id: 1,
      title: 'Frontend Developer Interview',
      date: 'Mar 15, 2024',
      score: '/100',
      category: 'Technical',
      icon: faHtml5,
    },
    {
      id: 2,
      title: 'Full Stack Developer Interview',
      date: 'Mar 14, 2024',
      score: '/100',
      category: 'Mixed',
      icon: faCss3Alt,
    },
    {
      id: 3,
      title: 'Full Stack Developer Interview',
      date: 'Mar 14, 2024',
      score: '/100',
      category: 'Mixed',
      icon: faCss3Alt,
    },
  ];

  return (
    <>
      <Navbar ref={navbarRef} />

      <section>
        <div className="container" style={{ marginTop, padding: '20px' }}>
          <div
            className="card"
            style={{
              maxWidth: '600px',
              margin: '0 auto',
              backgroundColor: '#282c34',
              color: 'white',
              borderRadius: '10px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
            }}
          >
            <div className="card-body">
              <h5 className="card-title" style={{ color: 'white' }}>
                Get Interview-Ready with AI-Powered Practice And Feedback
              </h5>
              <p className="card-text">
                Practice real interview questions and get instant feedback.
              </p>
              <Link
                to="/interview"
                className="btn btn-primary"
                style={{
                  backgroundColor: '#61dafb',
                  borderColor: '#61dafb',
                  color: '#282c34',
                  fontWeight: 'bold',
                }}
              >
                Start an Interview
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="container mt-5">
          <h2 className="text-center mb-4 text-white">Your Interviews</h2>
          <div className="row">
            {interviews.map((interview) => (
              <div className="col-md-6 mb-4" key={interview.id}>
                <div className="card bg-dark text-white">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <FontAwesomeIcon icon={interview.icon} size="3x" />
                      <span className={`badge ${interview.category === 'Technical' ? 'bg-secondary' : 'bg-primary'}`}>
                        {interview.category}
                      </span>
                    </div>
                    <h5 className="card-title">{interview.title}</h5>
                    <p className="card-text">
                      <FontAwesomeIcon icon={faLaptopCode} className="mr-2" /> {interview.date} - {interview.score}
                    </p>
                    <p className="card-text">
                      You haven't taken the interview yet. Take it now to improve your skills.
                    </p>
                    <button className="btn btn-outline-light">View Interview</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* famous interviews */}
      <section>
        <div className="container mt-5">
          <h2 className="text-center mb-4 text-white">Take an Interview</h2>
          <div className="row">
            {interviews.map((interview) => (
              <div className="col-md-6 mb-4" key={interview.id}>
                <div className="card bg-dark text-white">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <FontAwesomeIcon icon={interview.icon} size="3x" />
                      <span className={`badge ${interview.category === 'Technical' ? 'bg-secondary' : 'bg-primary'}`}>
                        {interview.category}
                      </span>
                    </div>
                    <h5 className="card-title">{interview.title}</h5>
                    <p className="card-text">
                      <FontAwesomeIcon icon={faLaptopCode} className="mr-2" /> {interview.date} - {interview.score}
                    </p>
                    <p className="card-text">
                      You haven't taken the interview yet. Take it now to improve your skills.
                    </p>
                    <button className="btn btn-outline-light">View Interview</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;