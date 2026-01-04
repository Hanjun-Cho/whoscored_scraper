import { useEffect, useRef, useState } from "react";
import { Navigate } from "react-router-dom";

function Search(props) {
  const urlRef = useRef(null);
  const [hasSubmittedData, setHasSubmittedData] = useState(false);

  useEffect(() => {
    submitURL()
  }, []);

  async function submitURL() {
    const options = {
      method: 'GET',
    }

    try {
      const temp_url = `${import.meta.env.VITE_API_URL}get_chalkboard_data?url=https://www.whoscored.com/matches/1903261/live/england-premier-league-2025-2026-tottenham-sunderland`
      // const res = await fetch(`${import.meta.env.VITE_API_URL}get_chalkboard_data?url=${urlRef.current?.value}`, options);
      const res = await fetch(temp_url, options); 
      const data = await res.json();
      props.setMatchData(data);
      setHasSubmittedData(true);
    }
    catch(err) {
      console.error(err);
    }
  }

  if (hasSubmittedData) {
    return <Navigate to="/chalkboard"/>
  }

  return (
    <div className="search-container">
      <h1>Enter Whoscored URL</h1>
      <input ref={urlRef} placeholder='whoscored url'/>
      <button onClick={submitURL}>Submit</button>
    </div>
  );
}

export default Search;
