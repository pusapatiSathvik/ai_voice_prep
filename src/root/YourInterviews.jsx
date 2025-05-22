import React,{useRef} from 'react'
import Navbar from '../components/Navbar'
 import InterviewsFetch from './InterviewsFetch';
const YourInterviews = () => {
    const navbarRef = useRef(null);
    //  const [marginTop, setMarginTop] = useState('80px');

  return (
    <>
    <Navbar ref={navbarRef} />
    <div className="container" style={{ marginTop : '80px', padding: '20px' }}>
        <InterviewsFetch/>
    </div>
    </>
  )
}

export default YourInterviews