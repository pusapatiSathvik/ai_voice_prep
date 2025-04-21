import React, { useState, useEffect } from "react";
import Vapi from "@vapi-ai/web";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import aiInterviewerLogo from './logo.svg';
import userLogo from './logo.svg';
import axios from 'axios';

const vapi = new Vapi(process.env.VAPI_WEB_Token);

const Agent = ({ userName: propUserName, userId, questions, interviewId, jobRole }) => {
  console.log("userName prop:", propUserName);
  console.log("userId prop:", userId);
  console.log("questions prop:", questions);
  console.log("interviewId prop:", interviewId);
  console.log("jobRole prop:", jobRole);

  const [localUserName, setLocalUserName] = useState('');
  const [jobPosition, setJobPosition] = useState('');
  const [startInterview, setStartInterview] = useState(false);
  const [activeUser, setActiveUser] = useState(false);
  const [conversation, setConversation] = useState([]);
  const [callStatus, setCallStatus] = useState("IDLE");
  const [converrsation,setConverrsation] = useState();

  const navigate = useNavigate();
  const interviewQuestions = questions || [];

  useEffect(() => {
    setLocalUserName(propUserName || '');
    setJobPosition(jobRole || '');
  }, [propUserName, jobRole]);

  useEffect(() => {
    vapi.on("speech-start", () => {
      console.log("Assistant speech has started.");
      setActiveUser(false);
    });

    vapi.on("speech-end", () => {
      console.log("Assistant speech has ended.");
      setActiveUser(true);
    });

    vapi.on("call-start", () => {
      console.log("Call has started.");
      alert("Call connected..");
      setCallStatus("ACTIVE");
    });

    vapi.on("call-end", () => {
      console.log("Call has ended.");
      alert("Interview ended..");
      setCallStatus("ENDED");
      GenerateFeedback(converrsation);
    });

    vapi.on("message", (message) => {
      console.log("VAPI Message:", message);
      console.log(message?.converrsation);
      setConverrsation(message?.converrsation);
    });

    // This empty dependency array ensures this effect runs only once after the initial render
    return () => {
      // Optional: Clean up event listeners if needed when the component unmounts
      vapi.removeAllListeners("speech-start");
      vapi.removeAllListeners("speech-end");
      vapi.removeAllListeners("call-start");
      vapi.removeAllListeners("call-end");
      vapi.removeAllListeners("message");
    };
  }, []); // Empty dependency array

  const handleStart = () => {
    if (localUserName && interviewQuestions.length > 0 && jobPosition) {
      setStartInterview(true);
      startCall();
    } else {
      alert("Error: Please ensure your name, job role, and interview questions are provided.");
    }
  };

  const handleStop = () => {
    vapi.stop();
  };

  const handleRepeat = () => {
    vapi.repeat();
  };

  const startCall = () => {
    const questionList = interviewQuestions.join(", ");
    console.log("Question List:", questionList);
    const assistantOptions = {
      name: "AI Recruiter",
      firstMessage: `Hi ${localUserName}, how are you? Ready for your interview on ${jobPosition}?`,
      transcriber: {
        provider: "deepgram",
        model: "nova-2",
        language: "en-US",
      },
      voice: {
        provider: "playht",
        voiceId: "jennifer",
      },
      model: {
        provider: "openai",
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `
                  You are an AI voice assistant conducting interviews for the role of ${jobPosition}.
                  Your job is to ask candidates provided interview questions, assess their responses.
                  Begin the conversation with a friendly introduction, setting a relaxed yet professional tone. Example:
                  "Hey there ${localUserName}! Welcome to your ${jobPosition} interview. Let’s get started with a few questions!"
                  Ask one question at a time and wait for the candidate’s response before proceeding. Keep the questions clear and concise. Below are the questions ask one by one:
                  Questions: ${questionList}
                  If the candidate struggles, offer hints or rephrase the question without giving away the answer. Example:
                  "Need a hint? Think about how React tracks component updates!"
                  Provide brief, encouraging feedback after each answer. Example:
                  "Nice! That’s a solid answer."
                  "Hmm, not quite! Want to try again?"
                  Keep the conversation natural and engaging—use casual phrases like "Alright, next up…" or "Let’s tackle a tricky one!"
                  After ${Math.min(5, interviewQuestions.length)}-${Math.min(7, interviewQuestions.length)} questions, wrap up the interview smoothly by summarizing their performance. Example:
                  "That was great! You handled some tough questions well. Keep sharpening your skills!"
                  End on a positive note:
                  "Thanks for chatting ${localUserName}! Hope to see you crushing projects soon!"
                  Key Guidelines:
                  ✅ Be friendly, engaging, and witty
                  ✅ Keep responses short and natural, like a real conversation
                  ✅ Adapt based on the candidate’s confidence level
                  ✅ Ensure the interview remains focused on topics relevant to a ${jobPosition} role.
                  ✅ Do not ask any questions that are not in the provided list.
                  ✅ Only end the interview after all the provided questions have been asked and answered, or after a maximum of 7 questions.
              `.trim(),
          },
        ],
      },
    };

    // Start the interview using the assistantOptions
    vapi.start(assistantOptions);
    setCallStatus("ACTIVE");
  };

  const GenerateFeedback = async (conversationHistory) => {
    try {
      const feedbackResponse = await axios.post(`http://localhost:3030/api/interview/${interviewId}/feedback`,{
        Conversation : conversationHistory,
        userId: userId, // Send userId to the backend
        jobRole: jobPosition, // Send jobRole to the backend (if needed for saving)
        candidateName: localUserName,
      });
      console.log("Feedback from backend:", feedbackResponse.data);

      if (feedbackResponse.data && feedbackResponse.data.feedbackId) {
        const feedbackId = feedbackResponse.data.feedbackId;
        navigate(`/interview/${interviewId}/feedback/${feedbackId}`); // Navigate with feedback ID
      } else {
        alert("Error: Could not retrieve feedback ID from the backend.");
      }
    } catch (error) {
      console.error("Error generating and saving feedback:", error);
      alert("Error generating feedback. Please try again later.");
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
              <h5 className="card-title text-center">{localUserName}</h5>
            </div>
          </div>
        </div>
      </div>

      <div className="row justify-content-center">
        <div className="col-md-8 d-flex justify-content-center">
          {callStatus !== "ACTIVE" ? (
            <button className="btn btn-primary" onClick={handleStart} disabled={callStatus === "ACTIVE" || callStatus === "ENDED"}>
              {callStatus === "ENDED" ? "Interview Ended" : "Start Interview"}
            </button>
          ) : (
            <>
              <button className="btn btn-secondary mr-2" onClick={handleRepeat} disabled={!activeUser}>
                Repeat
              </button>
              <button className="btn btn-danger" onClick={handleStop}>
                Leave Interview
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Agent;