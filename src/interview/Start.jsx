import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Camera } from "lucide-react";
import Webcam from "react-webcam";
import { Button } from "react-bootstrap";
import useSpeechToText from "react-hook-speech-to-text";



const InterviewPage = () => {
  const {
    error,
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false,
  });
  const questions = [
    "How do you ensure code quality and maintainability in a large-scale React application?",
    "Explain the concept of closures in JavaScript.",
    "What are the benefits of using TypeScript in a React project?",
    "How would you handle performance optimization in a React app?",
    "What is the difference between controlled and uncontrolled components?",
    "How do you manage side effects in React?",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <div className="container my-4">
      <h2 className="mb-4">Interview ID: 123</h2>

      <div className="row">
        {/* Left Card */}
        <div className="col-md-8">
          <div className="card" style={{ height: "600px" }}>
            <div className="card-body d-flex flex-column">
              {/* Question Number Buttons */}
              <div className="mb-3">
                {questions.map((_, idx) => (
                  <button
                    key={idx}
                    className={`btn btn-sm me-2 mb-2 ${
                      currentIndex === idx
                        ? "btn-primary"
                        : "btn-outline-secondary"
                    }`}
                    onClick={() => setCurrentIndex(idx)}
                  >
                    Question #{idx + 1}
                  </button>
                ))}
              </div>

              {/* Question Text */}
              <div
                className="border rounded p-3 mt-auto"
                style={{ minHeight: "150px" }}
              >
                {questions[currentIndex]}
              </div>
            </div>
          </div>
        </div>

        {/* Right Card */}
        <div className="col-md-4">
          <div className="card" style={{ height: "600px" }}>
            <div className="card-body d-flex align-items-center justify-content-center text-muted">
              {/* Right card content goes here (empty for now) */}
              <div>
                <Camera size={200} />
                <Webcam
                  mirrored="true"
                  className="w-100 rounded"
                  style={{ maxHeight: "300px", objectFit: "cover" }}
                />
              </div>
            </div>
            {/* <Button>Record Answer</Button> */}
          </div>


          <h1>Recording: {isRecording.toString()}</h1>
          <button onClick={isRecording ? stopSpeechToText : startSpeechToText}>
            {isRecording ? "Stop Recording" : "Start Recording"}
          </button>
          <ul>
            {results.map((result) => (
              <li key={result.timestamp}>{result.transcript}</li>
            ))}
            {interimResult && <li>{interimResult}</li>}
          </ul>
          
        </div>
      </div>
    </div>
  );
};

export default InterviewPage;
