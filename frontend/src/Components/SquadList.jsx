import { useEffect } from "react"; 
import './SquadList.css';
import SquadListPlayer from "./SquadListPlayer";

function SquadList(props) {
  useEffect(() => {
    //console.log(props.squadList)
  }, [props.squadList]);

  return (
    <div className="squadlist-container">
      {
        props.squadList.map(player => {
          return <SquadListPlayer 
            key={player['playerId']} 
            data={player} 
            isHome={props.isHome} 
            selectPlayer={props.selectPlayer}
            deselectPlayer={props.deselectPlayer}
            isSelected={props.isSelected}
          />
        })
      }
    </div>
  )
}

export default SquadList;
