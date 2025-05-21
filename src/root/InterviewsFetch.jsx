import { useState, useEffect } from "react"; // Import useEffect
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
// import { Link } from "react-router-dom"; // Link is not directly used for the button, but might be for other navigation

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeInOut' } }, // Added transition for animation
};

const InterviewsFetch = () => {
const navigate = useNavigate();
  const { currentUser, loading } = useAuth();
  // Use optional chaining for currentUser?.uid to safely access uid
  const currentUserId = currentUser?.uid;

  const [interviews, setInterviews] = useState([]);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState(null); // State to handle fetch errors
  const serverUrl = process.env.REACT_APP_SERVER_URL;

  // --- useEffect to automatically fetch interviews ---
  useEffect(() => {
    // Only attempt to fetch if currentUser.uid is available and we're not already fetching
    if (currentUserId && !fetching) {
      handleFetchInterviews();
    }
  },[]); // Dependency array: re-run this effect when currentUserId changes

  const handleFetchInterviews = async () => {
    // Prevent fetching if userId is not available
    if (!currentUserId) {
      console.warn("User ID not available. Cannot fetch interviews.");
      return;
    }

    try {
      console.log(`Sending GET request to ${serverUrl}/interviewIDs with userId: ${currentUserId}`);
      setFetching(true);
      setError(null); // Clear any previous errors

      const response = await axios.get(`${serverUrl}/interviewIDs`, {
        params: { userId: currentUserId }, // for GET requests, use query params
      });
      setInterviews(response.data);
      console.log("Fetched interviews:", response.data);
    } catch (error) {
      console.error("Error fetching interviews:", error);
      // Set a user-friendly error message
      setError("Failed to fetch interviews. Please try again later.");
    } finally {
      setFetching(false);
    }
  };

  const handleSeeFeedback = async (interviewId) => {
    if (!interviewId) {
      alert("No feedback available yet.");
    } else {
      // In a real app, you'd likely open a modal, navigate to a feedback page,
      // or display the feedback in a more structured way.
      alert(interviewId);
      try{
        console.log(`Sending GET request to ${serverUrl}/feedbackID with Interviewid: ${interviewId}`);
        const response = await axios.get(`${serverUrl}/feedbackID`, {
        params: { Id: interviewId,
            userId: currentUserId,
         },
      });
        console.log(response.data);
        const { feedbackId, feedback } = response.data;
        console.log("Feedback ID:", feedbackId);
        // console.log("Feedback ID:", feedback);
        if(feedbackId){
            navigate(`/interview/${interviewId}/feedback/${feedbackId}`);
        }
      }catch(error){
        console.error("Error fetching feedback:", error);
        alert("Failed to fetch feedback. Please try again later.");
      }


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
      .join(', '); // Join with a comma and space for better readability
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
      <div className="text-center mb-4">
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
      </div>

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
            {interviews.map(({ interviewId, interview, feedback }) => (
              <motion.div
                key={interviewId}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                className="col-md-6 mb-4"
              >
                <div
                  className="card bg-dark text-white h-100"
                  style={{
                    borderRadius: "12px",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                    transition: "all 0.3s ease",
                  }}
                >
                  <div className="card-body d-flex flex-column">
                    <h5
                      className="card-title"
                      style={{ fontSize: "1.5rem", fontWeight: "bold" }}
                    >
                      {capitalizeFirstLetter(interview.role) || "Untitled Interview"}
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

                    <button
                      className="btn btn-outline-light mt-auto"
                      onClick={() => handleSeeFeedback(interviewId)}
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