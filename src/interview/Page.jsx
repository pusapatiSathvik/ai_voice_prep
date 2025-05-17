// import React from 'react';
// import { useLocation } from "react-router-dom";
// import Agent from '../components/Agent';

// const Page = () => {
//   const location = useLocation();
//   const { questions, interviewId, role } = location.state || {};

//   // Get username and userId from localStorage
//   const userName = localStorage.getItem('userName') || "DefaultUser"; // Provide a default
//   const userId = localStorage.getItem('userId') || "DefaultUserID";     // Provide a default

//   return (
//     <>
//       <div>Interview Page</div>
//       <Agent
//         userName={userName}
//         userId={userId}
//         questions={questions}
//         interviewId={interviewId}
//         jobRole={role}
//       />
//     </>
//   );
// };

// export default Page;
import React from 'react';
import { useLocation } from "react-router-dom";
import Agent from '../components/Agent';
import { useAuth } from '../contexts/AuthContext'; // Import the useAuth hook

const Page = () => {
    const location = useLocation();
    const { questions, interviewId, role } = location.state || {};
    const { currentUser, userData } = useAuth(); // Get user data from context

    // Determine username.  userData.name is preferred.
    const userName = userData?.name || currentUser?.displayName || currentUser?.email || "DefaultUser";
    const userId = currentUser?.uid || "DefaultUserID"; // Get userId from currentUser

    return (
        <>
            <Agent
                userName={userName}
                userId={userId}
                questions={questions}
                interviewId={interviewId}
                jobRole={role}
            />
        </>
    );
};

export default Page;
