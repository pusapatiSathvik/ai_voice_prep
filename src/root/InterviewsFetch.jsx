import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const InterviewsFetch = () => {
  const { currentUser, loading } = useAuth();
  const currentUserId = currentUser.uid;
  const [interviews, setInterviews] = useState([]);
  const [fetching, setFetching] = useState(false);
  const serverUrl = process.env.REACT_APP_SERVER_URL;

  const handleFetchInterviews = async () => {
    try {
      console.log(`get req to ${serverUrl}/interviewIDs`);
      console.log(currentUserId);
      setFetching(true);
      const response = await axios.get(`${serverUrl}/interviewIDs`, {
        params: { userId: currentUserId }, // for GET requests, use query params
      });
      setInterviews(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching interviews:", error);
    } finally {
      setFetching(false);
    }
  };
  const handleSeeFeedback = (feedback) => {
    if (!feedback) {
      alert("No feedback available yet.");
    } else {
      // Here you can do something like open modal or navigate
      alert(JSON.stringify(feedback, null, 2));
    }
  };

  const capitalizeFirstLetter = (str) => {
    if (!str || typeof str !== "string") return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const formatTechStack = (str) => {
  if (!str || typeof str !== 'string') return '';
  return str
    .split(',')                          // Split by comma
    .map(word => word.trim())           // Trim spaces
    .map(word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    )
    .join(',');                          // Join with space
};
  return (
    <div className="container mt-5">
      <h2 className="text-center text-white mb-4" style={{ fontSize: "2rem" }}>
        Your Interviews
      </h2>
      <div className="text-center mb-4">
        <button
          className="btn btn-primary"
          onClick={handleFetchInterviews}
          disabled={fetching || loading}
        >
          {fetching ? "Loading..." : "Fetch Interviews"}
        </button>
      </div>

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
                      {capitalizeFirstLetter(interview.role)|| "Untitled Interview"}
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
                      <strong>Type:</strong> {capitalizeFirstLetter(interview.type)|| "No type"}
                    </p>
                    <p className="card-text mb-1">
                      <strong>Level:</strong> {capitalizeFirstLetter(interview.level)|| "No type"}
                    </p>
                    <p className="card-text mb-3">
                      <strong>Topics:</strong>{" "}
                      {formatTechStack(interview.techstack)|| "Not specified"}
                    </p>

                    <button
                      className="btn btn-outline-light mt-auto"
                      onClick={() => handleSeeFeedback(feedback)}
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
