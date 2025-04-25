import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../Firebase/client';
import { Button, Form } from 'react-bootstrap'; // Using React Bootstrap components
import { Loader2 } from 'lucide-react'; // For the loading spinner
import { motion } from 'framer-motion'; // For animations

const Interview = () => {
  const serverUrl = process.env.REACT_APP_SERVER_URL;
  const userId = localStorage.getItem("userId");
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({}); // State for form validation errors

  const [formData, setFormData] = useState({
    role: "",
    type: "",
    level: "",
    techstack: "",
    amount: "",
    userid: userId,
  });

  const navigate = useNavigate();

  // Validation function
  const validateForm = (data) => {
    let errors = {};
    if (!data.role.trim()) {
      errors.role = "Role is required";
    }
    if (!data.type.trim()) {
      errors.type = "Type is required";
    }
    if (!data.level.trim()) {
      errors.level = "Level is required";
    }
    if (!data.techstack.trim()) {
      errors.techstack = "Tech Stack is required";
    }
    if (!data.amount.trim()) {
      errors.amount = "Number of Questions is required";
    } else if (isNaN(Number(data.amount)) || Number(data.amount) <= 0) {
      errors.amount = "Invalid number";
    }
    return errors;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
    setFormErrors({ // Clear error on change
      ...formErrors,
      [e.target.id]: null,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validateForm(formData);
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) {
      return; // Stop submission if there are errors
    }

    setLoading(true);
    try {
      console.log(`post req to ${serverUrl}/api`)
      const response = await axios.post(`${serverUrl}/api`, formData);
      const { interviewId } = response.data;

      const interview = await fetchInterviewById(interviewId);
      const questions = interview.questions;
      const role = interview.role;

      setLoading(false);
      navigate("/generate", { state: { questions, interviewId, role } });
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
      return docSnap.data();
    } else {
      throw new Error('Interview not found');
    }
  };

  return (
    <>
      <section>
        <div className="container" style={{ marginTop: "80px", padding: "20px" }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
            className="card"
            style={{
              maxWidth: "600px",
              margin: "0 auto",
              backgroundColor: "#282c34",
              color: "white",
              borderRadius: "12px",
              boxShadow: "0 6px 12px rgba(0, 0, 0, 0.3)",
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            <div className="card-body">
              <h1
                className="card-title text-center mb-4"
                style={{
                  color: "#61dafb",
                  fontSize: "2.5rem",
                  fontWeight: "bold",
                  textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
                }}
              >
                Get Interview-Ready
              </h1>
              <p
                className="card-text text-center mb-4"
                style={{ fontSize: "1.1rem", lineHeight: "1.7" }}
              >
                Practice real interview questions and get instant feedback.  Fill out the form below to
                start your personalized interview session.
              </p>

              {loading ? (
                <div className="d-flex justify-content-center my-4">
                  <Loader2 className="h-8 w-8 animate-spin text-info" />
                </div>
              ) : (
                <Form onSubmit={handleSubmit} className="container mt-4">
                  <Form.Group className="mb-4">
                    <Form.Label style={{ fontWeight: 'bold' }}>
                      Role
                    </Form.Label>
                    <Form.Control
                      type="text"
                      id="role"
                      onChange={handleChange}
                      value={formData.role}
                      placeholder="e.g., Software Engineer"
                      className={formErrors.role ? 'is-invalid' : ''}
                    />
                    {formErrors.role && (
                      <Form.Control.Feedback type="invalid">
                        {formErrors.role}
                      </Form.Control.Feedback>
                    )}
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label style={{ fontWeight: 'bold' }}>
                      Type
                    </Form.Label>
                    <Form.Select
                      id="type"
                      onChange={handleChange}
                      value={formData.type}
                      className={formErrors.type ? 'is-invalid' : ''}
                    >
                      <option value="">Select Type</option>
                      <option value="Technical">Technical</option>
                      <option value="Mixed">Mixed</option>
                      <option value="Logical">Logical</option>
                    </Form.Select>
                    {formErrors.type && (
                      <Form.Control.Feedback type="invalid">
                        {formErrors.type}
                      </Form.Control.Feedback>
                    )}
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label style={{ fontWeight: 'bold' }}>
                      Level
                    </Form.Label>
                    <Form.Control
                      type="text"
                      id="level"
                      onChange={handleChange}
                      value={formData.level}
                      placeholder="e.g., Senior"
                      className={formErrors.level ? 'is-invalid' : ''}
                    />
                    {formErrors.level && (
                      <Form.Control.Feedback type="invalid">
                        {formErrors.level}
                      </Form.Control.Feedback>
                    )}
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label style={{ fontWeight: 'bold' }}>
                      Tech Stack
                    </Form.Label>
                    <Form.Control
                      type="text"
                      id="techstack"
                      onChange={handleChange}
                      value={formData.techstack}
                      placeholder="e.g., React, Node.js"
                      className={formErrors.techstack ? 'is-invalid' : ''}
                    />
                    {formErrors.techstack && (
                      <Form.Control.Feedback type="invalid">
                        {formErrors.techstack}
                      </Form.Control.Feedback>
                    )}
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label style={{ fontWeight: 'bold' }}>
                      Number of Questions
                    </Form.Label>
                    <Form.Control
                      type="number"
                      id="amount"
                      onChange={handleChange}
                      value={formData.amount}
                      placeholder="e.g., 10"
                      className={formErrors.amount ? 'is-invalid' : ''}
                    />
                    {formErrors.amount && (
                      <Form.Control.Feedback type="invalid">
                        {formErrors.amount}
                      </Form.Control.Feedback>
                    )}
                  </Form.Group>

                  <Button
                    type="submit"
                    className="w-100"
                    style={{
                      backgroundColor: "#61dafb",
                      borderColor: "#61dafb",
                      color: "#282c34",
                      fontWeight: "bold",
                      borderRadius: "8px",
                      padding: "12px",
                      fontSize: "1.2rem",
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        backgroundColor: '#42a5f5',
                        borderColor: '#42a5f5',
                        transform: 'scale(1.05)'
                      }
                    }}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      "Start an Interview"
                    )}
                  </Button>
                </Form>
              )}
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Interview;
