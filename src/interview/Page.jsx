import React from 'react'
import { useLocation } from "react-router-dom";
import Agent from '../components/Agent';
const exportedUserName = "bunny";
const exportedUserId = "m4OuLHGiv4V2XMt7NYsVgj1EDK83"
const Page = () => {
  const location = useLocation();
  const { questions, interviewId,role} = location.state || {};
  return (
    <>
    <div>Interview Page</div>
    <div>{process.env.REACT_APP_VAPI_WEB_TOKEN}</div>
    <Agent 
        userName={exportedUserName} 
        userId={exportedUserId}
        questions={questions}
        interviewId={interviewId}
        jobRole={role}

    />
    </>
  )
}

export default Page;