import React, { useState, useEffect } from "react";
import Vapi from "@vapi-ai/web";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import aiInterviewerLogo from './logo.svg';
import userLogo from './logo.svg';

const Agent = ({ userName, userId, interviewId, feedbackId, type, questions }) => {
  const router = useNavigate();
  const [callStatus, setCallStatus] = useState("INACTIVE");
  const [messages, setMessages] = useState([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [lastMessage, setLastMessage] = useState("");
  const [vapiInstance, setVapiInstance] = useState(null);
  const [vapiInitialized, setVapiInitialized] = useState(false);

  useEffect(() => {
    const initializeVapi = async () => {
      try {
        const publicKey = process.env.VAPI_WEB_Token;
        if (publicKey) {
          const newVapiInstance = new Vapi(publicKey);
          setVapiInstance(newVapiInstance);
          setVapiInitialized(true);
        } else {
          console.error("VAPI Public Key not found in environment variables.");
        }
      } catch (error) {
        console.error("Error initializing Vapi:", error);
      }
    };
    initializeVapi();
  }, []);

  useEffect(() => {
    if (vapiInitialized && vapiInstance) {
      const onCallStart = () => {
        setCallStatus("ACTIVE");
      };

      const onCallEnd = () => {
        setCallStatus("FINISHED");
      };

      const onMessage = (message) => {
        if (message.type === "transcript" && message.transcriptType === "final") {
          const newMessage = { role: message.role, content: message.transcript };
          setMessages((prev) => [...prev, newMessage]);
        }
      };

      const onSpeechStart = () => {
        console.log("speech start");
        setIsSpeaking(true);
      };

      const onSpeechEnd = () => {
        console.log("speech end");
        setIsSpeaking(false);
      };

      const onError = (error) => {
        console.log("Error:", error);
      };

      vapiInstance.on("call-start", onCallStart);
      vapiInstance.on("call-end", onCallEnd);
      vapiInstance.on("message", onMessage);
      vapiInstance.on("speech-start", onSpeechStart);
      vapiInstance.on("speech-end", onSpeechEnd);
      vapiInstance.on("error", onError);

      return () => {
        if (vapiInstance) {
          vapiInstance.off("call-start", onCallStart);
          vapiInstance.off("call-end", onCallEnd);
          vapiInstance.off("message", onMessage);
          vapiInstance.off("speech-start", onSpeechStart);
          vapiInstance.off("speech-end", onSpeechEnd);
          vapiInstance.off("error", onError);
        }
      };
    }
  }, [vapiInitialized, vapiInstance]);

  useEffect(() => {
    if (messages.length > 0) {
      setLastMessage(messages[messages.length - 1].content);
    }

    const handleGenerateFeedback = async (messages) => {
      console.log("handleGenerateFeedback");
      router.push("/");
    };

    if (callStatus === "FINISHED") {
      if (type === "generate") {
        router.push("/");
      } else {
        handleGenerateFeedback(messages);
      }
    }
  }, [messages, callStatus, feedbackId, interviewId, router, type, userId]);

  const handleCall = async () => {
    if (vapiInstance) {
      setCallStatus("CONNECTING");

      if (type === "generate") {
        await vapiInstance.start(process.env.REACT_APP_VAPI_WORKFLOW_ID, {
          variableValues: {
            username: userName,
            userid: userId,
          },
        });
      } else {
        await vapiInstance.start(process.env.REACT_APP_VAPI_WORKFLOW_ID, {
          variableValues: {
            username: userName,
            userid: userId,
          },
        });
      }
    }
  };

  const handleDisconnect = () => {
    if (vapiInstance) {
      setCallStatus("FINISHED");
      vapiInstance.stop();
    }
  };

  return (
    <div className="container-fluid agent-cards-container">
      <div className="row justify-content-center">
        <div className="col-md-6 mb-4">
          <div className="card ai-card">
            <div className="card-body d-flex flex-column align-items-center justify-content-center">
              <img src={aiInterviewerLogo} alt="AI Interviewer Logo" className="card-avatar" />
              <h5 className="card-title text-center">AI Interviewer</h5>
            </div>
          </div>
        </div>
        <div className="col-md-6 mb-4">
          <div className="card user-card">
            <div className="card-body d-flex flex-column align-items-center justify-content-center">
              <img src={userLogo} alt="User Logo" className="card-avatar" />
              <h5 className="card-title text-center">Adrian (You)</h5>
            </div>
          </div>
        </div>
      </div>
      <div className="row justify-content-center mb-4">
        <div className="col-md-8 question-box">
          <p className="question-text text-center">
            What job experience level are you targeting?
          </p>
        </div>
      </div>
      <div className="row justify-content-center">
        <div className="col-md-8 d-flex justify-content-center">
          <button className="btn btn-secondary mr-2">Repeat</button>
          <button className="btn btn-danger">Leave interview</button>
        </div>
      </div>
    </div>
  );
};

export default Agent;