import React from 'react'
import { useLocation } from "react-router-dom";
import Agent from '../components/Agent';
import TestVapiCall from '../components/TestVapiCall';
import SimpleCallPage from '../components/SimpleCallPage';
const exportedUserName = "bunny";
const exportedUserId = "vwPVYowZn4OiEAMQkVttn6crTCE3"
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
    {/* <TestVapiCall/> */}
    {/* <SimpleCallPage/> */}
    </>
  )
}

export default Page;