import { useState } from 'react'

const Display = props => <div>{props.value}</div>
const Button = (props) => (
  <button onClick={props.handleClick}>
    {props.text}
  </button>
)
const Header = () => {
  return (
  <div>
    <h1>give feedback</h1>
  </div>
  )
}
const StatisticLine = ({text, value, unit}) => {
  return (
    <tr>
      <td>{text}</td>
      <td> {value} {unit} </td>
    </tr>
  )
}
const Statistics = (props) => {
  if (props.all === 0) {  
    return (
      <div>
        <h1>statistics</h1>
        No feedback given
      </div>
    )
  }
  return (
    <div>
      <h1>statistics</h1>
      <table>
        <tbody>
          <StatisticLine text="good" value = {props.good}/>
          <StatisticLine text="neutral" value = {props.neutral}/>
          <StatisticLine text="bad" value = {props.bad}/>
          <StatisticLine text="all" value = {props.all}/>
          <StatisticLine text="average" value = {(props.good - props.bad) / props.all}/>
          <StatisticLine text="positive" value = {(props.good / props.all*100)} unit = "%"/>
        </tbody>
      </table>
    </div>
  )
}
const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [all, setAll] = useState(0)
  const handleGoodClick = () => {
    setAll(all + 1)
    setGood(good + 1)
  }
  const handleNeutralClick = () => {
    setAll(all + 1)
    setNeutral(neutral + 1)
  }
  const handleBadClick = () => {
    setAll(all + 1)
    setBad(bad + 1)
  }
  return (
    <div>
      <Header/>
      <Button handleClick={handleGoodClick} text='good'/>
      <Button handleClick={handleNeutralClick} text='neutral'/>
      <Button handleClick={handleBadClick} text='bad'/>
      <Statistics good={good} neutral={neutral} bad={bad} all={all}/>
      
    </div>
  )
}

export default App