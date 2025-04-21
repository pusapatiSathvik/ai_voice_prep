import React from 'react'
import { useLocation } from "react-router-dom";
import Agent from '../components/Agent';
import TestVapiCall from '../components/TestVapiCall';
import SimpleCallPage from '../components/SimpleCallPage';
const exportedUserName = "bunny";
const exportedUserId = "m4OuLHGiv4V2XMt7NYsVgj1EDK83"
const Page = () => {
  const location = useLocation();
  const { questions, interviewId,role} = location.state || {};
  return (
    <>
    <div>Interview Page</div>
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