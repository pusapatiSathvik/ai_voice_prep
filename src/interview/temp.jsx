// import React, { useState } from 'react'
// import { useLocation, useNavigate } from 'react-router-dom'
// import Webcam from "react-webcam"
// import { Camera } from 'lucide-react';
// import { Button } from 'react-bootstrap';
// const QuestionsPage = () => {
//     const location = useLocation();
//     const navigate = useNavigate();
//     const [webCamEnable,setwebCamEnable] = useState(false);

  
//     const questions = location.state?.questions;
  
//     // if (!questions) {
//     //   return (
//     //     <div className="container mt-5 text-center">
//     //       <h4>No questions available.</h4>
//     //       <button className="btn btn-secondary mt-3" onClick={() => navigate("/")}>
//     //         Go Back
//     //       </button>
//     //     </div>
//     //   );
//     // }
  
//     return (
//       <>
//       {/* <div className="container mt-5">
//         <h3 className="mb-4">Your Interview Questions</h3>
//         <ol className="list-group list-group-numbered">
//           {questions.map((q, index) => (
//             <li key={index} className="list-group-item">
//               {q}
//             </li>
//           ))}
//         </ol>
//       </div> */}


//       <div className="container mt-5">
//         <h3 className="mb-4">Lets get started</h3>
//         <div>
//           {webCamEnable?           
//             <Webcam onUserMedia={()=> setwebCamEnable(true)}
//              onUserMediaError={()=> setwebCamEnable(false)} mirrored={true} audio='true' style={{
//               height:300,
//               weight:300
//             }}/>
//             :
//             <>
//             <Camera size={400} style={{color:"white"}}/>
//             <Button onClick={()=>setwebCamEnable(true)}>Enable Web Cam and Microphone</Button>

//             </>


            
//           }
//         </div>
        
//       </div>
//       </>

//     );
//   };
// export default QuestionsPage
