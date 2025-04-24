import React, { useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../Firebase/client";
import { format } from 'date-fns';

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
        const data = docSnap.data();
        // Check if the necessary feedback fields exist
        if (data.questionAnalysis && data.overallRating && data.overallSummary && data.recommendation && data.recommendationMessage) {
          setFeedbackData(data);
        }
        else {
          setError("Incomplete feedback data found.  Please check the database.");
        }
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

    const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
        try {
            const date = timestamp.toDate();
            return format(date, 'PPPppp');
        } catch (e) {
            console.error("Error formatting date", e);
            return 'Invalid Date';
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

          <h5>Question Analysis</h5>
          {feedbackData.questionAnalysis && feedbackData.questionAnalysis.map((qna, index) => (
            <div key={index} className="mb-3">
              <p><strong>Question:</strong> {qna.question}</p>
              <p><strong>User Response Summary:</strong> {qna.userResponseSummary}</p>
              <p><strong>Relevance:</strong> {qna.relevanceAnalysis.relevant}</p>
              <p><strong>Relevance Reasoning:</strong> {qna.relevanceAnalysis.reasoning}</p>
            </div>
          ))}

          <h5>Overall Rating</h5>
          <ul>
            <li><strong>Technical Skills:</strong> {feedbackData.overallRating?.technicalSkills}/10</li>
            <li><strong>Communication:</strong> {feedbackData.overallRating?.communication}/10</li>
            <li><strong>Problem Solving:</strong> {feedbackData.overallRating?.problemSolving}/10</li>
            <li><strong>Experience:</strong> {feedbackData.overallRating?.experience}/10</li>
          </ul>

          <h5>Overall Summary</h5>
          <p>{feedbackData.overallSummary}</p>

          <h5>Recommendation</h5>
          <p><strong>Decision:</strong> {feedbackData.recommendation}</p>
          <p><strong>Message:</strong> {feedbackData.recommendationMessage}</p>

          <p><strong>Created At:</strong> {formatDate(feedbackData.createdAt)}</p>
        </div>
      )}
    </div>
  );
};

export default SearchFeedbackById;
