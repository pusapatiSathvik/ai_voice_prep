import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../Firebase/client';
const Interview = () => {
  const [marginTop, setMarginTop] = useState("80px");
  const userId = localStorage.getItem("userId");

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    role: "",
    type: "",
    level: "",
    techstack: "",
    amount: "",
    userid: userId,
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:3030/api", formData);
      const { interviewId } = response.data; // ✅ Correct for Axios
  
      const interview = await fetchInterviewById(interviewId);
      console.log("Fetched Interview:", interview);
      console.log("Fetched Interview:", interview.questions);
      const questions = interview.questions
      const role = interview.role
  
      setLoading(false);
      navigate("/generate", { state: { questions,interviewId,role} });

    } catch (error) {
      console.error("Axios error:", error);
      setLoading(false);
      alert("Failed to fetch questions.");
    }
  };
  

  const fetchInterviewById = async (interviewId) => {
    const docRef = doc(db, 'interviews', interviewId);
    const docSnap = await getDoc(docRef);
  
    if (docSnap.exists()) {
      return docSnap.data(); // Interview data
    } else {
      throw new Error('Interview not found');
    }
  };



  return (
    <>
      <section>
        <div className="container" style={{ marginTop, padding: "20px" }}>
          <div
            className="card"
            style={{
              maxWidth: "600px",
              margin: "0 auto",
              backgroundColor: "#282c34",
              color: "white",
              borderRadius: "10px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            }}
          >
            <div className="card-body">
              <h5 className="card-title" style={{ color: "white" }}>
                Get Interview-Ready with AI-Powered Practice And Feedback
              </h5>
              <p className="card-text">
                Practice real interview questions and get instant feedback.
              </p>

              {loading ? (
                <div className="d-flex justify-content-center my-4">
                  <div className="spinner-border text-info" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="container mt-5">
                  <div className="mb-3">
                    <label htmlFor="role" className="form-label">
                      Role
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="role"
                      onChange={handleChange}
                      value={formData.role}
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="type" className="form-label">
                      Type
                    </label>
                    <select
                      id="type"
                      className="form-select"
                      onChange={handleChange}
                      value={formData.type}
                    >
                      <option>Technical</option>
                      <option>Mixed</option>
                      <option>Logical</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="level" className="form-label">
                      Level
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="level"
                      onChange={handleChange}
                      value={formData.level}
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="techstack" className="form-label">
                      Tech Stack
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="techstack"
                      onChange={handleChange}
                      value={formData.techstack}
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="amount" className="form-label">
                      Number of Questions
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="amount"
                      onChange={handleChange}
                      value={formData.amount}
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{
                      backgroundColor: "#61dafb",
                      borderColor: "#61dafb",
                      color: "#282c34",
                      fontWeight: "bold",
                      borderRadius: "6px",
                      padding: "6px",
                    }}
                  >
                    Start an Interview
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Interview;
