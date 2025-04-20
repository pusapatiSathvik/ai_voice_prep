import React from 'react'
import Agent from '../components/Agent';
import TestVapiCall from '../components/TestVapiCall';
// import { exportedUserId,exportedUserName } from '../../Auth/AuthLayout';
import SimpleCallPage from '../components/SimpleCallPage';
const exportedUserName = "bunny";
const exportedUserId = "vwPVYowZn4OiEAMQkVttn6crTCE3"
const Page = () => {
  return (
    <>
    <div>Interview Page</div>
    <Agent userName={exportedUserName} userid={exportedUserId}/>
    {/* <TestVapiCall/> */}
    {/* <SimpleCallPage/> */}
    </>
  )
}

export default Page;