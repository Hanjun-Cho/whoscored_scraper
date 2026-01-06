import { useEffect, useRef, useState } from 'react';
import './Pitch.css';
import PitchBackgroud from './PitchBackground';
import PassMap from './PassMap'


function Pitch(props) {
  const pitchRef = useRef(null);
  const [pitchRect, setPitchRect] = useState({'height': 0});

  useEffect(() => {
    if(pitchRef.current) {
      setPitchRect(pitchRef.current.getBoundingClientRect());
    }
  }, [props.window]);

  useEffect(() => {
    console.log("x", props.selectedPlayers)
  }, [props.selectedPlayers])

  const style = {
    left: ((props.pitchContainerRect.height - pitchRect.height) / 2) + 'px',
  }

  return (
    <div ref={pitchRef} style={{style}} className='pitch'>
      <PitchBackgroud/>
      <PassMap 
        passData={props.passData} 
        playerData={props.playerData}
        teamData={props.teamData}
        selectedPlayers={props.selectedPlayers}
        pitchRect={pitchRect}
      />
    </div>
  )
}

export default Pitch;
