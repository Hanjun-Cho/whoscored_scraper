import { Navigate } from 'react-router-dom';
import Pitch from './Components/Pitch';
import './Chalkboard.css';
import { useEffect, useRef, useState } from 'react';
import useWindowDimension from './Window';

function getPasses(data) {
  console.log(data);
  const allPasses = {};
  const pass = data['matchCentreData']['events'].filter(type => type['type']['displayName'] === "Pass");
  const offside = data['matchCentreData']['events'].filter(type => type['type']['displayName'] === "OffsidePass");
  const blocked = data['matchCentreData']['events'].filter(type => type['type']['displayName'] === "BlockedPass");
  allPasses['Pass'] = pass;
  allPasses['Offside'] = offside;
  allPasses['Blocked'] = blocked;
  return allPasses;
}

function getTeams(data) {
  const team = {}
  team['home'] = data['matchCentreData']['home'];
  team['away'] = data['matchCentreData']['away'];
  return team;
}

function Chalkboard(props) {
  const pitchContainerRef = useRef(null);
  const [pitchContainerRect, setPitchContainerRect] = useState({'height': 0});
  const [passData, setPassData] = useState(null);
  const [teamData, setTeamData] = useState(null);
  const windowDimensions = useWindowDimension();

  useEffect(() => {
    if (pitchContainerRef.current) {
      setPitchContainerRect(pitchContainerRef.current.getBoundingClientRect());
    }
    if(props.matchData){
      setPassData(getPasses(props.matchData));
      setTeamData(getTeams(props.matchData));
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
      <Pitch window={windowDimensions} pitchContainerRect={pitchContainerRect} 
      passData={passData} 
      teamData={teamData}
      playerData={props.matchData['matchCentreData']['playerIdNameDictionary']}/>
      <h1>{props.matchData["matchCentreData"]["home"]["name"]}</h1>
      <h1>{props.matchData["matchCentreData"]["away"]["name"]}</h1>
    </div>
  );
}

export default Chalkboard;
