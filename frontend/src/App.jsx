import { useRef } from 'react';
import './App.css'

function App() {
  const urlRef = useRef(null);

  async function submitURL() {
    const options = {
      method: 'GET',
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}get_chalkboard_data?url=${urlRef.current?.value}`, options);
      const data = await res.json();
      console.log(data)
    }
    catch(err) {
      console.error(err);
    }
  }

  return (
    <>
      <h1>Enter Whoscored URL</h1>
      <input ref={urlRef} placeholder='whoscored url'/>
      <button onClick={submitURL}>Submit</button>
    </>
  )
}

export default App
