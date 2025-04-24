import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../Firebase/client";
import { format } from "date-fns";

const FeedbackDetails = () => {
  const { feedbackId } = useParams(); // Removed unused interviewId
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

  if (loading) return <div>Loading feedback...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!feedbackData) return <div>No feedback data available.</div>;

  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    try {
      const date = timestamp.toDate();
      return format(date, "PPPppp");
    } catch (e) {
      console.error("Error formatting date", e);
      return "Invalid Date";
    }
  };

  return (
    <div className="container mt-5">
      <div className="card p-4 shadow-sm">
        <h4>Feedback Details</h4>
        <p><strong>Interview ID:</strong> {feedbackData.interviewId}</p>
        <p><strong>User ID:</strong> {feedbackData.userId}</p>

        <h5>Question Analysis</h5>
        {feedbackData.questionAnalysis?.map((qna, index) => (
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
    </div>
  );
};

export default FeedbackDetails;
