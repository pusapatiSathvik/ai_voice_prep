import React, { useState, useEffect } from "react";
import Vapi from "@vapi-ai/web";

const SimpleCallPage = () => {
  const [vapiInstance, setVapiInstance] = useState(null);
  const [callStatus, setCallStatus] = useState("idle"); // 'idle', 'calling', 'active'
  const [error, setError] = useState(null);

  useEffect(() => {
    const publicKey = "ce5ccc60-fb4b-483f-bd5b-cf5b184b41c6" // Replace with your public key
    if (publicKey) {
      const newVapiInstance = new Vapi(publicKey);
      setVapiInstance(newVapiInstance);
    } else {
      setError("Public Key not found in environment variables.");
    }
    return () => {
      if(vapiInstance){
        vapiInstance.off('call-start', handleCallStart);
        vapiInstance.off('call-end', handleCallEnd);
        vapiInstance.off('error', handleError);
      }
    }
  }, [vapiInstance]);

  useEffect(() => {
    if (vapiInstance) {
      vapiInstance.on("call-start", handleCallStart);
      vapiInstance.on("call-end", handleCallEnd);
      vapiInstance.on("error", handleError);
    }
  }, [vapiInstance]);

  const handleCallStart = () => {
    setCallStatus("active");
    console.log("Call started");
  };

  const handleCallEnd = () => {
    setCallStatus("idle");
    console.log("Call ended");
  };

  const handleError = (err) => {
    setError(err.message || "An error occurred");
    console.error("Vapi Error:", err);
    setCallStatus('idle');
  };

  const startCall = async () => {
    if (!vapiInstance) return;
    setCallStatus("calling");

    try {
      await vapiInstance.start("35f159fc-e922-4bf9-b21a-57391b90b7de"); // Replace with your assistant ID
    } catch (err) {
      setError(err.message || "Failed to start call");
      setCallStatus("idle");
    }
  };

  const endCall = () => {
    if (vapiInstance) {
      vapiInstance.stop();
    }
  };

  return (
    <div>
      <h1>Simple Vapi Call</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {callStatus === "idle" && (
        <button onClick={startCall}>Start Call</button>
      )}

      {callStatus === "calling" && <p>Calling...</p>}

      {callStatus === "active" && (
        <button onClick={endCall}>End Call</button>
      )}
    </div>
  );
};

export default SimpleCallPage;