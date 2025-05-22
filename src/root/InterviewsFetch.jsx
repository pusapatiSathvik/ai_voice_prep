import { useState, useEffect,useRef } from "react";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeInOut' } }, // Added transition for animation
};

const InterviewsFetch = (props) => {
  console.log("limit is ..", props.limit); // should now show 2
  const limit = props.limit;
  const navigate = useNavigate();
  const { currentUser, loading } = useAuth();
  const currentUserId = currentUser?.uid;
  const [interviews, setInterviews] = useState([]);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState(null); // State to handle fetch errors
  const serverUrl = process.env.REACT_APP_SERVER_URL;
  const isToggleOnRef = useRef(false);
  const choice = () => {
    isToggleOnRef.current = !isToggleOnRef.current; // Flip the boolean value
    return isToggleOnRef.current; // Return the new value
  };
  useEffect(() => {
      const handleFetchInterviews = async (limit) => {
        if (!currentUserId) {
          console.warn("User ID not available. Cannot fetch interviews.");
          return;
        }
        try {
          console.log(`Sending GET request to ${serverUrl}/interviewIDs with userId: ${currentUserId}`);
          
          setFetching(true);
          setError(null);
    
          const response = await axios.get(`${serverUrl}/interviewIDs`, {
            params: { userId: currentUserId },
          });
          let interviewData = response.data;
          console.log(limit);
          if (limit && Array.isArray(interviewData)) {
            console.log(limit);
            interviewData = interviewData.slice(0, limit);
            setInterviews(interviewData);
            console.log("Fetched interviews:", interviewData);
          }else{
                setInterviews(response.data);
                console.log("Fetched interviews:", response.data);
          }
        } catch (error) {
          console.error("Error fetching interviews:", error);
          setError("Failed to fetch interviews. Please try again later.");
        } finally {
          setFetching(false);
        }
      };
    if (currentUserId && !fetching) {
      handleFetchInterviews(limit);
    }
    // eslint-disable-next-line
  },[]);

  const handleSeeFeedback = async (feedbackID,interviewId) => {
    if (!feedbackID) {
      alert("No feedback available yet.");
    } 
    else {
        navigate(`/interview/${interviewId}/feedback/${feedbackID}`);
    }
  };

  const capitalizeFirstLetter = (str) => {
    if (!str || typeof str !== "string") return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const formatTechStack = (str) => {
    if (!str || typeof str !== 'string') return '';
    return str
      .split(',') // Split by comma
      .map(word => word.trim()) // Trim spaces
      .map(word =>
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      )
      .join(', ');
  };

  // Display loading state while authentication is being checked or interviews are being fetched
  if (loading || fetching) {
    return (
      <div className="text-center text-white mt-5">
        Loading interviews...
      </div>
    );
  }

  // Display message if user is not logged in
  if (!currentUser) {
    return (
      <div className="text-center text-white mt-5">
        Please log in to view your interviews.
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h2 className="text-center text-white mb-4" style={{ fontSize: "2rem" }}>
        Your Past Interviews
      </h2>

      {/* The "Refresh Interviews" button can remain for manual re-fetching */}
      {/* <div className="text-center mb-4">
        <button
          className="btn btn-primary"
          onClick={handleFetchInterviews}
          disabled={fetching}
          style={{
            backgroundColor: '#61dafb',
            borderColor: '#61dafb',
            color: '#282c34',
            fontWeight: 'bold',
            padding: '10px 20px',
            borderRadius: '8px',
            transition: 'all 0.3s ease',
          }}
        >
          {fetching ? "Loading..." : "Refresh Interviews"}
        </button>
      </div> */}

      {/* Display error message if fetching failed */}
      {error && <div className="alert alert-danger text-center mt-3">{error}</div>}

      {/* Display message if no interviews are found */}
      {interviews.length === 0 && !fetching && !error && (
        <p className="text-center text-muted mt-4">
          You haven't completed any interviews yet. Start one from the home page!
        </p>
      )}

      {/* Render interview cards if interviews exist */}
      {interviews.length > 0 && (
        <section>
          <div className="row">
            {interviews.map(({ interviewId, interview, feedbackID
 }) => (
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
                          choice() ? 'bg-info' : 'bg-primary'
                        } text-white`}
                        style={{ fontSize: '0.9rem', padding: '8px 12px', borderRadius: '16px' }}
                      >
                        {interview.role}
                      </span>
                    </div>

                    <h5 className="card-title" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                      {capitalizeFirstLetter(interview.role) + " Interview"}
                    </h5>

                    <p className="card-text mb-1">
                      <strong>Date:</strong>{" "}
                      {interview.createdAt
                        ? new Date(interview.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              hour: "numeric",
                              minute: "2-digit",
                              hour12: true,
                            }
                          )
                        : "No date"}
                    </p>
                    <p className="card-text mb-1">
                      <strong>Type:</strong> {capitalizeFirstLetter(interview.type) || "No type"}
                    </p>
                    <p className="card-text mb-1">
                      <strong>Level:</strong> {capitalizeFirstLetter(interview.level) || "No level"}
                    </p>
                    <p className="card-text mb-3">
                      <strong>Topics:</strong>{" "}
                      {formatTechStack(interview.techstack) || "Not specified"}
                    </p>
                    <p className="card-text flex-grow-1" style={{ fontSize: '1.1rem' }}>
                      You haven't taken the interview yet. Take it now to improve your skills.
                    </p>

                    <button
                      className="btn btn-outline-light mt-auto"
                      onClick={() => handleSeeFeedback(feedbackID,interviewId)}
                      style={{
                        borderColor: "#61dafb",
                        color: "#61dafb",
                        fontWeight: "bold",
                        transition: "all 0.3s ease",
                      }}
                    >
                      See Feedback
                    </button>

                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default InterviewsFetch;