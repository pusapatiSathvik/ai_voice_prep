import React, { useRef, useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion'; // For animations

const Home = () => {
  const navbarRef = useRef(null);
  const [marginTop, setMarginTop] = useState('80px');
  const [userName, setUserName] = useState('');

  useEffect(() => {
    if (navbarRef.current) {
      setMarginTop(`${navbarRef.current.offsetHeight}px`);
    }

    // Get the user's name from localStorage
    const storedUserName = localStorage.getItem('userName');
    if (storedUserName) {
      setUserName(storedUserName);
    }
  }, []);

  // Interview data array
  const interviews = [
    {
      id: 1,
      title: 'Frontend Developer Interview',
      date: 'Mar 15, 2024',
      score: '/100',
      category: 'Frontend',
    },
    {
      id: 2,
      title: 'Full Stack Developer Interview',
      date: 'Mar 14, 2024',
      score: '/100',
      category: 'Full Stack',
    },
    {
      id: 3,
      title: 'React Interview',
      date: 'Mar 10, 2024',
      score: '/100',
      category: 'Frontend',
    },
    {
      id: 4,
      title: 'CSS Interview',
      date: 'Mar 12, 2024',
      score: '/100',
      category: 'Frontend',
    },
  ];

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeInOut' } },
  };

  return (
    <>
      <Navbar ref={navbarRef} />

      <section>
        <div className="container" style={{ marginTop, padding: '20px' }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
            className="card"
            style={{
              maxWidth: '600px',
              margin: '0 auto',
              backgroundColor: '#282c34',
              color: 'white',
              borderRadius: '12px',
              boxShadow: '0 6px 12px rgba(0, 0, 0, 0.3)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <div className="card-body text-center">
              <h1
                className="card-title mb-4"
                style={{
                  color: '#61dafb',
                  fontSize: '2.5rem',
                  fontWeight: 'bold',
                  textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
                }}
              >
                {userName ? `Hey ${userName},` : 'Welcome!'} Get Interview-Ready
              </h1>
              <p className="card-text mb-4" style={{ fontSize: '1.1rem', lineHeight: '1.7' }}>
                Practice real interview questions with our AI-powered platform and get instant feedback to
                boost your confidence.
              </p>
              <Link
                to="/interview"
                className="btn btn-primary"
                style={{
                  backgroundColor: '#61dafb',
                  borderColor: '#61dafb',
                  color: '#282c34',
                  fontWeight: 'bold',
                  padding: '12px 25px',
                  fontSize: '1.2rem',
                  borderRadius: '8px',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                  '&:hover': {
                    backgroundColor: '#42a5f5',
                    borderColor: '#42a5f5',
                    transform: 'scale(1.05)',
                  },
                }}
              >
                Start an Interview
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section>
        <div className="container mt-5">
          <h2 className="text-center mb-4 text-white" style={{ fontSize: '2rem' }}>
            Your Interviews
          </h2>
          <div className="row">
            {interviews.map((interview) => (
              <motion.div
                key={interview.id}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                className="col-md-6 mb-4"
              >
                <div
                  className="card bg-dark text-white h-100"
                  style={{
                    borderRadius: '12px',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'scale(1.03)',
                      boxShadow: '0 6px 12px rgba(0, 0, 0, 0.3)',
                    },
                  }}
                >
                  <div className="card-body d-flex flex-column">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <span style={{ fontSize: '2rem' }}></span>
                      <span
                        className={`badge ${
                          interview.category === 'Frontend' ? 'bg-info' : 'bg-primary'
                        } text-white`}
                        style={{ fontSize: '0.9rem', padding: '8px 12px', borderRadius: '16px' }}
                      >
                        {interview.category}
                      </span>
                    </div>
                    <h5 className="card-title" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                      {interview.title}
                    </h5>
                    <p className="card-text mb-2" style={{ fontSize: '1rem' }}>
                      {interview.date} - {interview.score}
                    </p>
                    <p className="card-text flex-grow-1" style={{ fontSize: '1.1rem' }}>
                      You haven't taken the interview yet. Take it now to improve your skills.
                    </p>
                    <Link
                      to="/interview"
                      className="btn btn-outline-light mt-auto"
                      style={{
                        borderColor: '#61dafb',
                        color: '#61dafb',
                        fontWeight: 'bold',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          backgroundColor: '#61dafb',
                          color: '#282c34',
                          borderColor: '#61dafb',
                        },
                      }}
                    >
                      View Interview
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Famous Interviews Section */}
      <section>
        <div className="container mt-5">
          <h2 className="text-center mb-4 text-white" style={{ fontSize: '2rem' }}>
            Take an Interview
          </h2>
          <div className="row">
            {interviews.map((interview) => (
              <motion.div
                key={interview.id}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                className="col-md-6 mb-4"
              >
                <div
                  className="card bg-dark text-white h-100"
                  style={{
                    borderRadius: '12px',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'scale(1.03)',
                      boxShadow: '0 6px 12px rgba(0, 0, 0, 0.3)',
                    },
                  }}
                >
                  <div className="card-body d-flex flex-column">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <span style={{ fontSize: '2rem' }}></span>
                      <span
                        className={`badge ${
                          interview.category === 'Frontend' ? 'bg-info' : 'bg-primary'
                        } text-white`}
                        style={{ fontSize: '0.9rem', padding: '8px 12px', borderRadius: '16px' }}
                      >
                        {interview.category}
                      </span>
                    </div>
                    <h5 className="card-title" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                      {interview.title}
                    </h5>
                    <p className="card-text mb-2" style={{ fontSize: '1rem' }}>
                      {interview.date} - {interview.score}
                    </p>
                    <p className="card-text flex-grow-1" style={{ fontSize: '1.1rem' }}>
                      You haven't taken the interview yet. Take it now to improve your skills.
                    </p>
                    <Link
                      to="/interview"
                      className="btn btn-outline-light mt-auto"
                      style={{
                        borderColor: '#61dafb',
                        color: '#61dafb',
                        fontWeight: 'bold',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          backgroundColor: '#61dafb',
                          color: '#282c34',
                          borderColor: '#61dafb',
                        },
                      }}
                    >
                      View Interview
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
