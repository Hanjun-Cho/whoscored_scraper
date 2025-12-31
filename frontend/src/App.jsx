import { useState } from 'react';
import Chalkboard from './Chalkboard';
import Search from './Search';
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom';

function App() {
  const [matchData, setMatchData] = useState(null);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Search setMatchData={setMatchData}/>}/>
          <Route path="/chalkboard" element={<Chalkboard matchData={matchData}/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
