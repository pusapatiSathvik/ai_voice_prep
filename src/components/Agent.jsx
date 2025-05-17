// import React, { useState, useEffect, useCallback,useRef } from "react";
// import Vapi from "@vapi-ai/web";
// import "bootstrap/dist/css/bootstrap.min.css";
// import { useNavigate } from "react-router-dom";
// import { motion } from 'framer-motion';
// import axios from "axios";

// // Import the logo images
// import botLogo from './bot.png';
// import humanLogo from './human.png';

// const vapi = new Vapi(process.env.REACT_APP_VAPI_WEB_TOKEN);

// const Agent = ({
//     userName: propUserName,
//     userId,
//     questions,
//     interviewId,
//     jobRole,
// }) => {
//     // Logging for debugging
//     // console.log("VAPI Token:", process.env.REACT_APP_VAPI_WEB_TOKEN);
//     // console.log("userName prop:", propUserName);
//     // console.log("userId prop:", userId);
//     // console.log("questions prop:", questions);
//     // console.log("interviewId prop:", interviewId);
//     // console.log("jobRole prop:", jobRole);

//     // State variables
//     const [localUserName, setLocalUserName] = useState("");
//     const [jobPosition, setJobPosition] = useState("");
//     const [conversation, setConversation] = useState([]);
//     // const [conversation, setConversation] = useState(new Set());
//     const [callStatus, setCallStatus] = useState("IDLE");
//     const [isAssistantSpeaking, setIsAssistantSpeaking] = useState(false);
//     const [isUserSpeaking, setIsUserSpeaking] = useState(false);

//     const navigate = useNavigate();
//     const interviewQuestions = questions || [];
//     const currentAssistantMessage = useRef(null);
//     const currentUserMessage = useRef(null);

//     // Initialize user name and job position
//     useEffect(() => {
//         setLocalUserName(propUserName || "");
//         setJobPosition(jobRole || "");
//     }, [propUserName, jobRole]);

//     // Memoized function to generate and send feedback
//     const GenerateFeedback = useCallback(async (fullConversation) => {
//         console.log("Sending full conversation for processing...", fullConversation);

//         const conciseConversation = fullConversation.reduce((acc, turn, index, arr) => {
//             if (turn.role === 'assistant' && index + 1 < arr.length && arr[index + 1].role === 'user') {
//                 acc.push({ question: turn.content, answer: arr[index + 1].content });
//             }
//             return acc;
//         }, []);
//         console.log("Sending question-answer pairs for feedback...", conciseConversation);

//         try {
//             const feedbackResponse = await axios.post(
//                 `http://localhost:3030/api/interview/${interviewId}/feedback`,
//                 {
//                     Conversation: conciseConversation,
//                     userId: userId,
//                     jobRole: jobPosition,
//                     candidateName: localUserName,
//                 }
//             );

//             console.log("Feedback from backend:", feedbackResponse.data);

//             if (feedbackResponse.data?.feedbackId) {
//                 navigate(
//                     `/interview/${interviewId}/feedback/${feedbackResponse.data.feedbackId}`
//                 );
//             } else {
//                 alert("Error: Could not retrieve feedback ID from the backend.");
//             }
//         } catch (error) {
//             console.error("Error generating and saving feedback:", error);
//             alert("Error generating feedback. Please try again later.");
//         }
//     }, [interviewId, userId, jobPosition, localUserName, navigate]);

//     const conversationRef = useRef([]);
// useEffect(() => {
//     // Update the ref whenever conversation state changes
//     conversationRef.current = conversation;
// }, [conversation]); // Only update ref when 'conversation' state changes

// // VAPI event listeners
// useEffect(() => {
//         console.log("VAPI Token (once per mount):", process.env.REACT_APP_VAPI_WEB_TOKEN);
//         console.log("userName prop (once per mount):", propUserName);
//         console.log("userId prop (once per mount):", userId);
//         console.log("questions prop (once per mount):", questions);
//         console.log("interviewId prop (once per mount):", interviewId);
//         console.log("jobRole prop (once per mount):", jobRole);
//     const addMessageToConversation = (role, content) => {
//         if (content && content.trim() !== '') {
//             setConversation(prevConversation => {
//                 const lastMessage = prevConversation[prevConversation.length - 1];
//                 if (lastMessage && lastMessage.role === role && lastMessage.content === content) {
//                     return prevConversation;
//                 }
//                 return [...prevConversation, { role, content }];
//             });
//         }
//     };

//     vapi.on("speech-start", () => {
//         console.log("Assistant speech started.");
//         setIsAssistantSpeaking(true);
//         setIsUserSpeaking(false);
//         if (currentUserMessage.current) {
//             addMessageToConversation('user', currentUserMessage.current);
//             currentUserMessage.current = null;
//         }
//         currentAssistantMessage.current = "";
//     });

//     vapi.on("speech-end", () => {
//         console.log("Assistant speech ended.");
//         setIsAssistantSpeaking(false);
//         addMessageToConversation('assistant', currentAssistantMessage.current);
//         currentAssistantMessage.current = null;
//     });

//     vapi.on("user-speech-start", () => {
//         console.log("User speech started.");
//         setIsUserSpeaking(true);
//         setIsAssistantSpeaking(false);
//         if (currentAssistantMessage.current) {
//             addMessageToConversation('assistant', currentAssistantMessage.current);
//             currentAssistantMessage.current = null;
//         }
//         currentUserMessage.current = "";
//     });

//     vapi.on("user-speech-end", () => {
//         console.log("User speech ended.");
//         setIsUserSpeaking(false);
//         addMessageToConversation('user', currentUserMessage.current);
//         currentUserMessage.current = null;
//     });

//     vapi.on("call-start", () => {
//         console.log("Call started.");
//         alert("Call connected..");
//         setCallStatus("ACTIVE");
//         setConversation([]);
//         currentAssistantMessage.current = null; // Clear refs on new call
//         currentUserMessage.current = null;
//     });

//     vapi.on("call-end", () => {
//         console.log("Call ended.");
//         alert("Interview ended..");
//         setCallStatus("ENDED");

//         // Ensure any pending message is added before generating feedback
//         // Use a functional update or the ref for the final message to ensure it's in state
//         // This part needs careful handling as state updates are asynchronous
//         setConversation(prevConversation => {
//             let finalConversation = [...prevConversation];
//             if (currentAssistantMessage.current && currentAssistantMessage.current.trim() !== '') {
//                 finalConversation.push({ role: 'assistant', content: currentAssistantMessage.current });
//             }
//             if (currentUserMessage.current && currentUserMessage.current.trim() !== '') {
//                 finalConversation.push({ role: 'user', content: currentUserMessage.current });
//             }
//             // Now, call GenerateFeedback with this most up-to-date conversation
//             // Use setTimeout to ensure the state update has definitely propagated
//             // before GenerateFeedback uses it, if it were to read from the state directly.
//             // But since we pass it as an argument, it's fine.
//             GenerateFeedback(finalConversation); // Pass the finalized array directly
//             return finalConversation; // Update the state
//         });

//         currentAssistantMessage.current = null; // Clear refs after call end
//         currentUserMessage.current = null;
//     });


//     vapi.on("message", (message) => {
//         if (message?.conversation && message.conversation.length > 0) {
//             const latestTurn = message.conversation[message.conversation.length - 1];
//             if (latestTurn) {
//                 if (latestTurn.role === 'assistant') {
//                     currentAssistantMessage.current = latestTurn.content;
//                 } else if (latestTurn.role === 'user') {
//                     currentUserMessage.current = latestTurn.content;
//                 }
//             }
//         }
//     });

//     return () => {
//         vapi.removeAllListeners("speech-start");
//         vapi.removeAllListeners("speech-end");
//         vapi.removeAllListeners("user-speech-start");
//         vapi.removeAllListeners("user-speech-end");
//         vapi.removeAllListeners("call-start");
//         vapi.removeAllListeners("call-end");
//         vapi.removeAllListeners("message");
//     };
// }, [GenerateFeedback, propUserName, userId, questions, interviewId, jobRole]); // Removed 'conversation' from dependencies. 'GenerateFeedback' itself is already memoized.

//     // Function to start the interview call
//     const startCall = () => {
//         const questionList = interviewQuestions.join(", ");
//         console.log("Question List:", questionList);
//         const assistantOptions = {
//             name: "AI Recruiter",
//             firstMessage: `Hi ${localUserName}, how are you? Ready for your interview on ${jobPosition}?`,
//             transcriber: {
//                 provider: "deepgram",
//                 model: "nova-2",
//                 language: "en-US",
//             },
//             voice: {
//                 provider: "playht",
//                 voiceId: "jennifer",
//             },
//             model: {
//                 provider: "openai",
//                 model: "gpt-4",
//                 messages: [
//                     {
//                         role: "system",
//                         content: `
//               You are an AI voice assistant conducting interviews for the role of ${jobPosition}.
//               Your job is to ask candidates provided interview questions, assess their responses.
//               Begin the conversation with a friendly introduction, setting a relaxed yet professional tone. Example:
//               "Hey there ${localUserName}! Welcome to your ${jobPosition} interview. Let’s get started with a few questions!"
//               Ask one question at a time and wait for the candidate’s response before proceeding. Keep the questions clear and concise. Below are the questions ask one by one:
//               Questions: ${questionList}
//               If the candidate struggles, offer hints or rephrase the question without giving away the answer. Example:
//               "Need a hint? Think about how React tracks component updates!"
//               Provide brief, encouraging feedback after each answer. Example:
//               "Nice! That’s a solid answer."
//               "Hmm, not quite! Want to try again?"
//               Keep the conversation natural and engaging—use casual phrases like "Alright, next up…" or "Let’s tackle a tricky one!"
//               After ${Math.min(
//                             5,
//                             interviewQuestions.length
//                         )}-${Math.min(
//                             7,
//                             interviewQuestions.length
//                         )} questions, wrap up the interview smoothly by summarizing their performance. Example:
//               "That was great! You handled some tough questions well. Keep sharpening your skills!"
//               End on a positive note:
//               "Thanks for chatting ${localUserName}! Hope to see you crushing projects soon!"
//               Key Guidelines:
//               ✅ Be friendly, engaging, and witty
//               ✅ Keep responses short and natural, like a real conversation
//               ✅ Adapt based on the candidate’s confidence level
//               ✅ Ensure the interview remains focused on topics relevant to a ${jobPosition} role.
//               ✅ Do not ask any questions that are not in the provided list.
//               ✅ Only end the interview after all the provided questions have been asked and answered, or after a maximum of 7 questions.
//             `.trim(),
//                     },
//                 ],
//             },
//         };

//         vapi.start(assistantOptions);
//         setCallStatus("ACTIVE");
//     };

//     // Handlers for user interactions
//     const handleStart = () => {
//         if (localUserName && interviewQuestions.length > 0 && jobPosition) {
//             startCall();
//         } else {
//             alert(
//                 "Error: Please ensure your name, job role, and interview questions are provided."
//             );
//         }
//     };

//     const handleStop = () => {
//         vapi.stop();
//     };

//     const handleRepeat = () => {
//         vapi.repeat();
//     };

//     // Animation definitions
//     const logoVariants = {
//         idle: { opacity: 1, scale: 1 },
//         speaking: {
//             opacity: 0.8,
//             scale: 1.1,
//             transition: {
//                 yoyo: Infinity,
//                 duration: 0.6,
//                 ease: "easeInOut",
//             },
//         },
//     };

//     return (
//       <>
//       <div
//   className="container-fluid d-flex flex-column align-items-center justify-content-center"
//   style={{ minHeight: '100vh' }} // Optional outer bg
// >
//   <div
//     className="p-4 rounded"
//     style={{
//       backgroundColor: '#000',
//       borderRadius: '20px',
//       boxShadow: '0 0 20px rgba(0,0,0,0.6)',
//       width: '90%',
//       maxWidth: '1200px'
//     }}
//   >
//     {/* Cards Row */}
//     <div className="row w-100 mb-4 d-flex justify-content-between">
//       <div className="col-md-4 d-flex justify-content-start">
//         <div className="card ai-card" style={{ width: '500px', height: '400px' }}>
//           <div className="card-body d-flex flex-column align-items-center justify-content-center">
//             <motion.img
//               src={botLogo}
//               alt="AI Interviewer Logo"
//               className="card-avatar"
//               variants={logoVariants}
//               animate={isAssistantSpeaking ? "speaking" : "idle"}
//               style={{ width: '100%', height: '150px', objectFit: 'contain' }}
//             />
//             <h5 className="card-title text-center text-white">AI Interviewer</h5>
//           </div>
//         </div>
//       </div>
//       <div className="col-md-4 d-flex justify-content-end">
//         <div className="card user-card" style={{ width: '500px', height: '400px' }}>
//           <div className="card-body d-flex flex-column align-items-center justify-content-center">
//             <motion.img
//               src={humanLogo}
//               alt="User Logo"
//               className="card-avatar"
//               variants={logoVariants}
//               animate={isUserSpeaking ? "speaking" : "idle"}
//               style={{ width: '100%', height: '150px', objectFit: 'contain' }}
//             />
//             <h5 className="card-title text-center text-white">{localUserName}</h5>
//           </div>
//         </div>
//       </div>
//     </div>

//     {/* Button Row */}
//     <div className="row w-100 d-flex justify-content-center">
//       <div className="col-md-6 d-flex justify-content-center">
//         {callStatus !== "ACTIVE" ? (
//           <button
//             className="btn btn-primary"
//             onClick={handleStart}
//             disabled={callStatus === "ACTIVE" || callStatus === "ENDED"}
//           >
//             {callStatus === "ENDED" ? "Interview Ended" : "Start Interview"}
//           </button>
//         ) : (
//           <>
//             <button
//               className="btn btn-secondary mr-2"
//               onClick={handleRepeat}
//               disabled={isAssistantSpeaking}
//             >
//               Repeat
//             </button>
//             <button className="btn btn-danger ml-2" onClick={handleStop}>
//               Leave Interview
//             </button>
//           </>
//         )}
//       </div>
//     </div>
//   </div>
// </div>

//   </>
// )};
// export default Agent;




import React, { useState, useEffect, useCallback, useRef } from "react";
import Vapi from "@vapi-ai/web";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import { motion } from 'framer-motion';
import axios from "axios";
import { useAuth } from '../contexts/AuthContext'; // Import useAuth

// Import the logo images
import botLogo from './bot.png';
import humanLogo from './human.png';

const vapi = new Vapi(process.env.REACT_APP_VAPI_WEB_TOKEN);

const Agent = ({
    questions,
    interviewId,
    jobRole,
}) => {
    // Logging for debugging
    // console.log("VAPI Token:", process.env.REACT_APP_VAPI_WEB_TOKEN);
    // console.log("userName prop:", propUserName);  <-- Removed propUserName
    // console.log("userId prop:", userId);        <-- Removed userId
    // console.log("questions prop:", questions);
    // console.log("interviewId prop:", interviewId);
    // console.log("jobRole prop:", jobRole);

    // State variables
    const [localUserName, setLocalUserName] = useState("");
    const [jobPosition, setJobPosition] = useState("");
    const [conversation, setConversation] = useState([]);
    // const [conversation, setConversation] = useState(new Set());  <-- Removed Set
    const [callStatus, setCallStatus] = useState("IDLE");
    const [isAssistantSpeaking, setIsAssistantSpeaking] = useState(false);
    const [isUserSpeaking, setIsUserSpeaking] = useState(false);

    const navigate = useNavigate();
    const interviewQuestions = questions || [];
    const currentAssistantMessage = useRef(null);
    const currentUserMessage = useRef(null);

    const { currentUser, userData } = useAuth(); // Use the hook

    // Initialize user name and job position
    useEffect(() => {
        // setLocalUserName(propUserName || "");  <-- Removed propUserName
        setLocalUserName(userData?.name || currentUser?.displayName || currentUser?.email || "Candidate"); // Get from context
        setJobPosition(jobRole || "");
    }, [userData, currentUser, jobRole]); // Added userData and currentUser as dependencies

    // Memoized function to generate and send feedback
    const GenerateFeedback = useCallback(async (fullConversation) => {
        console.log("Sending full conversation for processing...", fullConversation);

        const conciseConversation = fullConversation.reduce((acc, turn, index, arr) => {
            if (turn.role === 'assistant' && index + 1 < arr.length && arr[index + 1].role === 'user') {
                acc.push({ question: turn.content, answer: arr[index + 1].content });
            }
            return acc;
        }, []);
        console.log("Sending question-answer pairs for feedback...", conciseConversation);

        try {
            const feedbackResponse = await axios.post(
                `http://localhost:3030/api/interview/${interviewId}/feedback`,
                {
                    Conversation: conciseConversation,
                    userId: currentUser?.uid, // Get from context
                    jobRole: jobPosition,
                    candidateName: localUserName,
                }
            );

            console.log("Feedback from backend:", feedbackResponse.data);

            if (feedbackResponse.data?.feedbackId) {
                navigate(
                    `/interview/${interviewId}/feedback/${feedbackResponse.data.feedbackId}`
                );
            } else {
                alert("Error: Could not retrieve feedback ID from the backend.");
            }
        } catch (error) {
            console.error("Error generating and saving feedback:", error);
            alert("Error generating feedback. Please try again later.");
        }
    }, [interviewId, currentUser?.uid, jobPosition, localUserName, navigate]); // Added currentUser

    const conversationRef = useRef([]);
    useEffect(() => {
        // Update the ref whenever conversation state changes
        conversationRef.current = conversation;
    }, [conversation]); // Only update ref when 'conversation' state changes

    // VAPI event listeners
    useEffect(() => {
        console.log("VAPI Token (once per mount):", process.env.REACT_APP_VAPI_WEB_TOKEN);
        // console.log("userName prop (once per mount):", propUserName);  <-- Removed
        // console.log("userId prop (once per mount):", userId);        <-- Removed
        console.log("questions prop (once per mount):", questions);
        console.log("interviewId prop (once per mount):", interviewId);
        console.log("jobRole prop (once per mount):", jobRole);

        const addMessageToConversation = (role, content) => {
            if (content && content.trim() !== '') {
                setConversation(prevConversation => {
                    const lastMessage = prevConversation[prevConversation.length - 1];
                    if (lastMessage && lastMessage.role === role && lastMessage.content === content) {
                        return prevConversation;
                    }
                    return [...prevConversation, { role, content }];
                });
            }
        };

        vapi.on("speech-start", () => {
            console.log("Assistant speech started.");
            setIsAssistantSpeaking(true);
            setIsUserSpeaking(false);
            if (currentUserMessage.current) {
                addMessageToConversation('user', currentUserMessage.current);
                currentUserMessage.current = null;
            }
            currentAssistantMessage.current = "";
        });

        vapi.on("speech-end", () => {
            console.log("Assistant speech ended.");
            setIsAssistantSpeaking(false);
            addMessageToConversation('assistant', currentAssistantMessage.current);
            currentAssistantMessage.current = null;
        });

        vapi.on("user-speech-start", () => {
            console.log("User speech started.");
            setIsUserSpeaking(true);
            setIsAssistantSpeaking(false);
            if (currentAssistantMessage.current) {
                addMessageToConversation('assistant', currentAssistantMessage.current);
                currentAssistantMessage.current = null;
            }
            currentUserMessage.current = "";
        });

        vapi.on("user-speech-end", () => {
            console.log("User speech ended.");
            setIsUserSpeaking(false);
            addMessageToConversation('user', currentUserMessage.current);
            currentUserMessage.current = null;
        });

        vapi.on("call-start", () => {
            console.log("Call started.");
            alert("Call connected..");
            setCallStatus("ACTIVE");
            setConversation([]);
            currentAssistantMessage.current = null; // Clear refs on new call
            currentUserMessage.current = null;
        });

        vapi.on("call-end", () => {
            console.log("Call ended.");
            alert("Interview ended..");
            setCallStatus("ENDED");

            // Ensure any pending message is added before generating feedback
            // Use a functional update or the ref for the final message to ensure it's in state
            // This part needs careful handling as state updates are asynchronous
            setConversation(prevConversation => {
                let finalConversation = [...prevConversation];
                if (currentAssistantMessage.current && currentAssistantMessage.current.trim() !== '') {
                    finalConversation.push({ role: 'assistant', content: currentAssistantMessage.current });
                }
                if (currentUserMessage.current && currentUserMessage.current.trim() !== '') {
                    finalConversation.push({ role: 'user', content: currentUserMessage.current });
                }
                // Now, call GenerateFeedback with this most up-to-date conversation
                // Use setTimeout to ensure the state update has definitely propagated
                // before GenerateFeedback uses it, if it were to read from the state directly.
                // But since we pass it as an argument, it's fine.
                GenerateFeedback(finalConversation); // Pass the finalized array directly
                return finalConversation; // Update the state
            });

            currentAssistantMessage.current = null; // Clear refs after call end
            currentUserMessage.current = null;
        });


        vapi.on("message", (message) => {
            if (message?.conversation && message.conversation.length > 0) {
                const latestTurn = message.conversation[message.conversation.length - 1];
                if (latestTurn) {
                    if (latestTurn.role === 'assistant') {
                        currentAssistantMessage.current = latestTurn.content;
                    } else if (latestTurn.role === 'user') {
                        currentUserMessage.current = latestTurn.content;
                    }
                }
            }
        });

        return () => {
            vapi.removeAllListeners("speech-start");
            vapi.removeAllListeners("speech-end");
            vapi.removeAllListeners("user-speech-start");
            vapi.removeAllListeners("user-speech-end");
            vapi.removeAllListeners("call-start");
            vapi.removeAllListeners("call-end");
            vapi.removeAllListeners("message");
        };
    }, [GenerateFeedback, questions, interviewId, jobRole, currentUser?.uid, userData?.name, currentUser?.displayName, currentUser?.email]); // Add currentUser and its properties

    // Function to start the interview call
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
                    After ${Math.min(
                            5,
                            interviewQuestions.length
                        )}-${Math.min(
                            7,
                            interviewQuestions.length
                        )} questions, wrap up the interview smoothly by summarizing their performance. Example:
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

        vapi.start(assistantOptions);
        setCallStatus("ACTIVE");
    };

    // Handlers for user interactions
    const handleStart = () => {
        if (localUserName && interviewQuestions.length > 0 && jobPosition) {
            startCall();
        } else {
            alert(
                "Error: Please ensure your name, job role, and interview questions are provided."
            );
        }
    };

    const handleStop = () => {
        vapi.stop();
    };

    const handleRepeat = () => {
        vapi.repeat();
    };

    // Animation definitions
    const logoVariants = {
        idle: { opacity: 1, scale: 1 },
        speaking: {
            opacity: 0.8,
            scale: 1.1,
            transition: {
                yoyo: Infinity,
                duration: 0.6,
                ease: "easeInOut",
            },
        },
    };

    return (
        <>
            <div
                className="container-fluid d-flex flex-column align-items-center justify-content-center"
                style={{ minHeight: '100vh' }} // Optional outer bg
            >
                <div
                    className="p-4 rounded"
                    style={{
                        backgroundColor: '#000',
                        borderRadius: '20px',
                        boxShadow: '0 0 20px rgba(0,0,0,0.6)',
                        width: '90%',
                        maxWidth: '1200px'
                    }}
                >
                    {/* Cards Row */}
                    <div className="row w-100 mb-4 d-flex justify-content-between">
                        <div className="col-md-4 d-flex justify-content-start">
                            <div className="card ai-card" style={{ width: '500px', height: '400px' }}>
                                <div className="card-body d-flex flex-column align-items-center justify-content-center">
                                    <motion.img
                                        src={botLogo}
                                        alt="AI Interviewer Logo"
                                        className="card-avatar"
                                        variants={logoVariants}
                                        animate={isAssistantSpeaking ? "speaking" : "idle"}
                                        style={{ width: '100%', height: '150px', objectFit: 'contain' }}
                                    />
                                    <h5 className="card-title text-center text-white">AI Interviewer</h5>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4 d-flex justify-content-end">
                            <div className="card user-card" style={{ width: '500px', height: '400px' }}>
                                <div className="card-body d-flex flex-column align-items-center justify-content-center">
                                    <motion.img
                                        src={humanLogo}
                                        alt="User Logo"
                                        className="card-avatar"
                                        variants={logoVariants}
                                        animate={isUserSpeaking ? "speaking" : "idle"}
                                        style={{ width: '100%', height: '150px', objectFit: 'contain' }}
                                    />
                                    <h5 className="card-title text-center text-white">{localUserName}</h5>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Button Row */}
                    <div className="row w-100 d-flex justify-content-center">
                        <div className="col-md-6 d-flex justify-content-center">
                            {callStatus !== "ACTIVE" ? (
                                <button
                                    className="btn btn-primary"
                                    onClick={handleStart}
                                    disabled={callStatus === "ACTIVE" || callStatus === "ENDED"}
                                >
                                    {callStatus === "ENDED" ? "Interview Ended" : "Start Interview"}
                                </button>
                            ) : (
                                <>
                                    <button
                                        className="btn btn-secondary mr-2"
                                        onClick={handleRepeat}
                                        disabled={isAssistantSpeaking}
                                    >
                                        Repeat
                                    </button>
                                    <button className="btn btn-danger ml-2" onClick={handleStop}>
                                        Leave Interview
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
export default Agent;

