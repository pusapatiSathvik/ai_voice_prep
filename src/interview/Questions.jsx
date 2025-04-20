import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Webcam from 'react-webcam';
import { Camera } from 'lucide-react';
import { Button } from 'react-bootstrap';

const QuestionsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [webCamEnable, setWebCamEnable] = useState(false);

  const jobData = location.state?.jobDetails || {
    role: 'Full Stack Developer',
    stack: 'React, NodeJs',
    experience: '4',
  };

  return (
    <div className="container py-5">
      <h3 className="text-center fw-bold mb-4">Let's Get Started</h3>

      <div className="row g-4 align-items-stretch">
        {/* Left Column */}
        <div className="col-12 col-md-6">
          <div className="h-100 min-vh-50 d-flex flex-column bg-light p-4 rounded shadow-sm">
            <h5><strong>Job Role/Job Position:</strong> {jobData.role}</h5>
            <h5><strong>Job Description/Tech Stack:</strong> {jobData.stack}</h5>
            <h5><strong>Years of Experience:</strong> {jobData.experience}</h5>

            <div className="bg-warning bg-opacity-25 border-start border-warning border-4 p-3 rounded mt-4 flex-grow-1">
              <h6 className="fw-bold">💡 Information</h6>
              <p className="mb-0">
                <span className="text-primary">You can enable Webcam and Microphone</span> if you'd like to simulate a more real-world interview scenario.
                <br />
                <strong>NOTE:</strong> We never record your video. You can skip this step and start the interview directly.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="col-12 col-md-6">
          <div className="h-100 min-vh-50 d-flex flex-column justify-content-between align-items-center bg-white p-4 rounded shadow-sm text-center">
            {webCamEnable ? (
              <Webcam
                onUserMedia={() => setWebCamEnable(true)}
                onUserMediaError={() => setWebCamEnable(false)}
                mirrored
                className="w-100 rounded"
                style={{ maxHeight: '300px', objectFit: 'cover' }}
              />
            ) : (
              <>
                <Camera size={120} className="mb-3 text-secondary" />
                <Button variant="primary" onClick={() => setWebCamEnable(true)}>
                  Enable Web Cam and Microphone
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Start Interview Button */}
      <div className="text-center mt-4">
        <Button variant="success" size="lg" onClick={() => navigate("/interview/start")}>
          Start Interview
        </Button>
      </div>
    </div>
  );
};

export default QuestionsPage;
