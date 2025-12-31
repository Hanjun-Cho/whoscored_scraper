import { Navigate } from 'react-router-dom';
import Pitch from './Components/Pitch';
import Window from './Window';
import './Chalkboard.css';
import { useEffect, useRef, useState } from 'react';

function Chalkboard(props) {
  const pitchContainerRef = useRef(null);
  const [pitchContainerRect, setPitchContainerRect] = useState({'height': 0});

  useEffect(() => {
    if (pitchContainerRef.current) {
      setPitchContainerRect(pitchContainerRef.current.getBoundingClientRect());
    }
  }, []);

  if (!props.matchData || props.matchData["status"] == "FAIL") {
    if(props.matchData) {
      console.log(props.matchData["message"]);
    }
    return <Navigate to="/"/>
  }

  return (
    <div ref={pitchContainerRef} className="chalkboard-container">
      <Pitch window={Window} pitchContainerRect={pitchContainerRect}/>
      <h1>{props.matchData["matchCentreData"]["home"]["name"]}</h1>
      <h1>{props.matchData["matchCentreData"]["away"]["name"]}</h1>
    </div>
  );
}

export default Chalkboard;
