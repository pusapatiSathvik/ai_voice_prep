import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../Firebase/client"; // Import the initialized db instance

const FeedbackDetails = () => {
  const { interviewId, feedbackId } = useParams();
  const [feedbackData, setFeedbackData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeedback = async () => {
      setLoading(true);
      setError(null);
      try {
        const docRef = doc(db, "feedbacks", feedbackId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setFeedbackData(docSnap.data());
        } else {
          setError("Feedback not found!");
        }
      } catch (err) {
        console.error("Error fetching feedback:", err);
        setError("Failed to fetch feedback.");
      } finally {
        setLoading(false);
      }
    };

    fetchFeedback();
  }, [feedbackId]);

  if (loading) {
    return <div>Loading feedback...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!feedbackData) {
    return <div>No feedback data available.</div>;
  }

  return (
    <div className="container mt-5">
      <h2>Feedback Details</h2>
      <p>
        <strong>Interview ID:</strong> {feedbackData.interviewId}
      </p>
      <p>
        <strong>User ID:</strong> {feedbackData.userId}
      </p>

      <h3>Rating:</h3>
      <p>
        <strong>Technical Skills:</strong>{" "}
        {feedbackData.rating?.technicalSkills}/10
      </p>
      <p>
        <strong>Communication:</strong> {feedbackData.rating?.communication}/10
      </p>
      <p>
        <strong>Problem Solving:</strong> {feedbackData.rating?.problemSolving}
        /10
      </p>
      <p>
        <strong>Experience:</strong> {feedbackData.rating?.experience}/10
      </p>

      <h3>Summary:</h3>
      <ul>
        {feedbackData.summary?.map((point, idx) => (
          <li key={idx}>{point}</li>
        ))}
      </ul>

      <h3>Recommendation:</h3>
      <p>
        <strong>Decision:</strong> {feedbackData.recommendation}
      </p>
      <p>
        <strong>Message:</strong> {feedbackData.recommendationMsg}
      </p>

      <p>
        <strong>Created At:</strong>
        {feedbackData.createdAt
          ? feedbackData.createdAt.toDate().toLocaleString()
          : "N/A"}
      </p>

      {/* You can add more details here as needed */}
    </div>
  );
};

export default FeedbackDetails;
