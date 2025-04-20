import React, { useState, useEffect } from "react";
import {Vapi} from "@vapi-ai/web"

const TestVapiCall = () => {
  const [call, setCall] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [volumeLevel, setVolumeLevel] = useState(0);
  const [error, setError] = useState(null);
  const [vapiInstance, setVapiInstance] = useState(null);

  useEffect(() => {
    const publicKey = "ce5ccc60-fb4b-483f-bd5b-cf5b184b41c6"; // Replace with your actual public key
    const newVapiInstance = new Vapi(publicKey);
    setVapiInstance(newVapiInstance);

    return () => {
      if (vapiInstance) {
        vapiInstance.off("speech-start", handleSpeechStart);
        vapiInstance.off("speech-end", handleSpeechEnd);
        vapiInstance.off("call-start", handleCallStart);
        vapiInstance.off("call-end", handleCallEnd);
        vapiInstance.off("volume-level", handleVolumeLevel);
        vapiInstance.off("message", handleMessage);
        vapiInstance.off("error", handleError);
      }
    };
  }, [vapiInstance]);

  useEffect(() => {
    if (vapiInstance) {
      vapiInstance.on("speech-start", handleSpeechStart);
      vapiInstance.on("speech-end", handleSpeechEnd);
      vapiInstance.on("call-start", handleCallStart);
      vapiInstance.on("call-end", handleCallEnd);
      vapiInstance.on("volume-level", handleVolumeLevel);
      vapiInstance.on("message", handleMessage);
      vapiInstance.on("error", handleError);
    }
  }, [vapiInstance]);

  const handleSpeechStart = () => {
    setIsSpeaking(true);
    console.log("Assistant speech has started.");
  };

  const handleSpeechEnd = () => {
    setIsSpeaking(false);
    console.log("Assistant speech has ended.");
  };

  const handleCallStart = () => {
    console.log("Call has started.");
  };

  const handleCallEnd = () => {
    console.log("Call has ended.");
  };

  const handleVolumeLevel = (volume) => {
    setVolumeLevel(volume);
    console.log(`Assistant volume level: ${volume}`);
  };

  const handleMessage = (message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
    console.log(message);
  };

  const handleError = (e) => {
    setError(e);
    console.error(e);
  };

  const startCall = async () => {
    if (vapiInstance) {
      try {
        const newCall = await vapiInstance.start("35f159fc-e922-4bf9-b21a-57391b90b7de"); // Replace with your assistant ID
        setCall(newCall);
      } catch (e) {
        setError(e);
        console.error(e);
      }
    }
  };

  const stopCall = () => {
    if (vapiInstance) {
      vapiInstance.stop();
    }
  };

  const sendMessage = () => {
    if (vapiInstance) {
      vapiInstance.send({
        type: "add-message",
        message: {
          role: "system",
          content: "The user has pressed the button, say peanuts",
        },
      });
    }
  };

  const muteToggle = () => {
    if (vapiInstance) {
      vapiInstance.setMuted(!vapiInstance.isMuted());
    }
  };

  const sayGoodbye = () => {
    if (vapiInstance) {
      vapiInstance.say("Our time's up, goodbye!", true);
    }
  };

  return (
    <div>
      <h1>Vapi Web SDK Test</h1>
      <button onClick={startCall}>Start Call</button>
      <button onClick={stopCall}>Stop Call</button>
      <button onClick={sendMessage}>Send Message</button>
      <button onClick={muteToggle}>Mute/Unmute</button>
      <button onClick={sayGoodbye}>Say Goodbye</button>

      {isSpeaking && <p>Assistant is speaking...</p>}
      <p>Volume Level: {volumeLevel}</p>

      {messages.length > 0 && (
        <div>
          <h2>Messages:</h2>
          <ul>
            {messages.map((message, index) => (
              <li key={index}>{JSON.stringify(message)}</li>
            ))}
          </ul>
        </div>
      )}

      {error && <p style={{ color: "red" }}>Error: {error.message}</p>}
    </div>
  );
};

export default TestVapiCall;