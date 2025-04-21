import React, { useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../Firebase/client";

const SearchFeedbackById = () => {
  const [feedbackId, setFeedbackId] = useState("");
  const [feedbackData, setFeedbackData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFetch = async () => {
    setLoading(true);
    setError("");
    setFeedbackData(null);

    try {
      const docRef = doc(db, "feedbacks", feedbackId.trim());
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setFeedbackData(docSnap.data());
      } else {
        setError("Feedback not found!");
      }
    } catch (err) {
      console.error("Error fetching feedback:", err);
      setError("Error fetching feedback. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-3">Search Feedback by ID</h2>

      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Enter Feedback ID"
          value={feedbackId}
          onChange={(e) => setFeedbackId(e.target.value)}
        />
      </div>

      <button className="btn btn-primary mb-4" onClick={handleFetch} disabled={loading}>
        {loading ? "Fetching..." : "Get Feedback"}
      </button>

      {error && <div className="alert alert-danger">{error}</div>}

      {feedbackData && (
        <div className="card p-4 shadow-sm">
          <h4>Feedback Details</h4>
          <p><strong>Interview ID:</strong> {feedbackData.interviewId}</p>
          <p><strong>User ID:</strong> {feedbackData.userId}</p>

          <h5>Ratings</h5>
          <ul>
            <li><strong>Technical Skills:</strong> {feedbackData.rating?.technicalSkills}/10</li>
            <li><strong>Communication:</strong> {feedbackData.rating?.communication}/10</li>
            <li><strong>Problem Solving:</strong> {feedbackData.rating?.problemSolving}/10</li>
            <li><strong>Experience:</strong> {feedbackData.rating?.experience}/10</li>
          </ul>

          <h5>Summary</h5>
          <ul>
            {feedbackData.summary?.map((point, idx) => (
              <li key={idx}>{point}</li>
            ))}
          </ul>

          <h5>Recommendation</h5>
          <p><strong>Decision:</strong> {feedbackData.recommendation}</p>
          <p><strong>Message:</strong> {feedbackData.recommendationMsg}</p>

          <p>
            <strong>Created At:</strong>{" "}
            {feedbackData.createdAt ? feedbackData.createdAt.toDate().toLocaleString() : "N/A"}
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchFeedbackById;
