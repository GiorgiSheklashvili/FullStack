import React, { useState } from 'react'

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)  

  return (
    <div>
      <div>
        <b><p>Give Feedback</p></b>
        <button onClick={()=> setGood(good + 1)}> Good </button>
        <button onClick={()=> setNeutral(neutral + 1)}> Neutral </button>
        <button onClick={()=> setBad(bad + 1)}> Bad </button>
      </div>
      <div>
        <b><p>Statistics</p></b>
        <div>good {good}</div>
        <div>neutral {neutral}</div>
        <div>bad {bad}</div>
        <div>all {good + bad + neutral}</div>
        <div>average {(good - bad)/(good + bad + neutral)}</div>
        <div>positive {(good/(good + bad + neutral)) * 100}%</div>
      </div>
    </div>
  )
}

export default App