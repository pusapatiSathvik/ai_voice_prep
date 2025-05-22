import { Link } from 'react-router-dom';
import { motion } from 'framer-motion'; // For animations
import { useAuth } from '../contexts/AuthContext'; // Import the useAuth hook
import InterviewsFetch from './InterviewsFetch'; // Update path as necessary

const Home = () => {
  const { currentUser, userData, loading } = useAuth();
  // const currentUserId = currentUser.uid;
  // Determine the display name:
  // 1. Prefer userData.name (from Firestore) if available
  // 2. Fallback to currentUser.displayName (from Firebase Auth profile) - Not used in the latest AuthContext
  // 3. Fallback to currentUser.email (if no display name is set) -  Not used in the latest AuthContext
  const displayUserName = userData?.name ||  '';
  // console.log(userData);
  // console.log(currentUser.uid);

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

  // Animation variants (remains the same)
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeInOut' } },
  };

  // Optional: Show a loading state while authentication is being checked
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'white' }}>
        Loading user data...
      </div>
    );
  }

  // If currentUser is null after loading, PrivateRoute should handle the redirect.
  // This check here is mostly for development or if Home could be accessed directly without PrivateRoute.
  if (!currentUser) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'white' }}>
        Please log in to view this page.
        {/* You might also consider a direct redirect here if not using PrivateRoute everywhere */}
        {/* <Link to="/sign-in">Go to Sign In</Link> */}
      </div>
    );
  }


  return (
    <>
      <section>
        <div className="container" style={{ marginTop : '80px', padding: '20px' }}>
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
                {displayUserName ? `Hey ${displayUserName},` : 'Welcome!'} Get Interview-Ready
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
                }}
              >
                Start an Interview
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <InterviewsFetch limit={2}/>

      {/* Famous Interviews Section - This section seems identical to "Your Interviews".
          You might want to refactor if they are truly meant to display different data,
          or remove one if it's redundant. Keeping it as-is based on your provided code for now. */}
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
