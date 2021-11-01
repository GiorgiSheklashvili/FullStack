import React, { useState } from 'react'

const StatisticLine = ({text, value}) => {
  if(text === "positive"){
    return (
      <tr><td>{text}</td><td>{value}%</td></tr>
    )  
  }
  return (
    <tr><td>{text}</td><td> {value}</td></tr>
  )
}

const Statistics = ({good, bad, neutral}) => {
  if (good + bad + neutral !== 0) {
    return (
        <div>
          <b><p>Statistics</p></b>
          <table style={{width: '7%'}}>
            <tbody>
              <StatisticLine text="good" value={good}></StatisticLine>
              <StatisticLine text="neutral" value={neutral}></StatisticLine>
              <StatisticLine text="bad" value={bad}></StatisticLine>
              <StatisticLine text="all" value={good + bad + neutral}></StatisticLine>
              <StatisticLine text="average" value={((good - bad)/(good + bad + neutral)).toFixed(2)}></StatisticLine>
              <StatisticLine text="positive" value={((good/(good + bad + neutral)) * 100).toFixed(2)}></StatisticLine>
            </tbody>
          </table>
        </div>
    )
  }
  return (
    <div>
      No feedbacks given
    </div>
  )
}

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
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App