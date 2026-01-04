import { Navigate } from 'react-router-dom';
import Pitch from './Components/Pitch';
import './Chalkboard.css';
import { useEffect, useRef, useState } from 'react';
import useWindowDimension from './Window';

function getPasses(data) {
  console.log(data);
  const pass = data['matchCentreData']['events'].filter(type => type['type']['displayName'] === "Pass");
  return pass;
}

function Chalkboard(props) {
  const pitchContainerRef = useRef(null);
  const [pitchContainerRect, setPitchContainerRect] = useState({'height': 0});
  const [passData, setPassData] = useState([]);
  const windowDimensions = useWindowDimension();

  useEffect(() => {
    if (pitchContainerRef.current) {
      setPitchContainerRect(pitchContainerRef.current.getBoundingClientRect());
    }
    if(props.matchData){
      setPassData(getPasses(props.matchData));
    }
  }, [props.matchData]);

  if (!props.matchData || props.matchData["status"] == "FAIL") {
    if(props.matchData) {
      console.error(props.matchData["message"]);
    }
    return <Navigate to="/"/>
  }
  return (
    <div ref={pitchContainerRef} className="chalkboard-container">
      <Pitch window={windowDimensions} pitchContainerRect={pitchContainerRect} passData={passData} playerData={props.matchData['matchCentreData']['playerIdNameDictionary']}/>
      <h1>{props.matchData["matchCentreData"]["home"]["name"]}</h1>
      <h1>{props.matchData["matchCentreData"]["away"]["name"]}</h1>
    </div>
  );
}

export default Chalkboard;
