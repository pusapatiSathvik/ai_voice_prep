"use client";

import React, { useState, useEffect } from "react";
// import Image from "next/image";
// import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { vapi } from "@/lib/vapi.sdk";
import { interviewer } from "@/constants";
import { createFeedback } from "@/lib/actions/general.action";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS

const Agent = ({ userName, userId, interviewId, feedbackId, type, questions }) => {
  const router = useRouter();
  const [callStatus, setCallStatus] = useState("INACTIVE");
  const [messages, setMessages] = useState([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [lastMessage, setLastMessage] = useState("");

  useEffect(() => {
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

    vapi.on("call-start", onCallStart);
    vapi.on("call-end", onCallEnd);
    vapi.on("message", onMessage);
    vapi.on("speech-start", onSpeechStart);
    vapi.on("speech-end", onSpeechEnd);
    vapi.on("error", onError);

    return () => {
      vapi.off("call-start", onCallStart);
      vapi.off("call-end", onCallEnd);
      vapi.off("message", onMessage);
      vapi.off("speech-start", onSpeechStart);
      vapi.off("speech-end", onSpeechEnd);
      vapi.off("error", onError);
    };
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      setLastMessage(messages[messages.length - 1].content);
    }

    const handleGenerateFeedback = async (messages) => {
      console.log("handleGenerateFeedback");

      const { success, feedbackId: id } = await createFeedback({
        interviewId: interviewId,
        userId: userId,
        transcript: messages,
        feedbackId: feedbackId,
      });

      if (success && id) {
        router.push(`/interview/${interviewId}/feedback`);
      } else {
        console.log("Error saving feedback");
        router.push("/");
      }
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
    setCallStatus("CONNECTING");

    if (type === "generate") {
      await vapi.start(process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID, {
        variableValues: {
          username: userName,
          userid: userId,
        },
      });
    } else {
      let formattedQuestions = "";
      if (questions) {
        formattedQuestions = questions.map((question) => `- ${question}`).join("\n");
      }

      await vapi.start(interviewer, {
        variableValues: {
          questions: formattedQuestions,
        },
      });
    }
  };

  const handleDisconnect = () => {
    setCallStatus("FINISHED");
    vapi.stop();
  };

  return (
    <>
      <div className="container-fluid">
        <div className="row justify-content-center">
          <div className="col-md-6 mb-4">
            <div className="card ai-card">
              <div className="card-body d-flex flex-column align-items-center justify-content-center">
                <div className="avatar">
                  <img src="/ai-avatar.png" alt="profile-image" width={65} height={54} className="object-cover" />
                  {isSpeaking && <span className="animate-speak" />}
                </div>
                <h5 className="card-title text-center">AI Interviewer</h5>
              </div>
            </div>
          </div>
          <div className="col-md-6 mb-4">
            <div className="card user-card">
              <div className="card-body d-flex flex-column align-items-center justify-content-center">
                <img src="/user-avatar.png" alt="profile-image" width={120} height={120} className="rounded-circle object-cover" />
                <h5 className="card-title text-center">{userName}</h5>
              </div>
            </div>
          </div>
        </div>
        {messages.length > 0 && (
          <div className="row justify-content-center mb-4">
            <div className="col-md-8 transcript-border">
              <div className="transcript">
                <p key={lastMessage} className={cn("transition-opacity duration-500 opacity-0 animate-fadeIn opacity-100")}>
                  {lastMessage}
                </p>
              </div>
            </div>
          </div>
        )}
        <div className="row justify-content-center">
          <div className="col-md-8 d-flex justify-content-center">
            {callStatus !== "ACTIVE" ? (
              <button className="btn btn-primary" onClick={() => handleCall()}>
                <span className={cn("absolute animate-ping rounded-full opacity-75", callStatus !== "CONNECTING" && "d-none")} />
                <span className="relative">{callStatus === "INACTIVE" || callStatus === "FINISHED" ? "Call" : ". . ."}</span>
              </button>
            ) : (
              <button className="btn btn-danger" onClick={() => handleDisconnect()}>
                End
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Agent;