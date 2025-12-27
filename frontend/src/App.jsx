import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <h1>Enter Whoscored URL</h1>
      <input/>
      <button>Submit</button>
    </>
  )
}

export default App
