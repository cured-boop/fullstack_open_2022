import { useState } from 'react'
const Header = () => {
  return (
  <div>
    <h1>Anecdote of the day</h1>
  </div>
  )
}
const MostVotes = ({anecdotes, points}) => {
  const i = points.indexOf(Math.max(...points))
  return (
    <div>
      <h1>Anecdote with most votes</h1>
      <p>{anecdotes[i]}</p>
      <p>has {points[i]} votes</p>
    </div>
  )
}
const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when dianosing patients.',
    'The only way to go fast, is to go well.'
  ] 
  const [selected, setSelected] = useState(0)
  const [points, setPoints] = useState([0, 0, 0, 0, 0, 0, 0, 0])
  const AddOne = () => {
    const copy = [...points] 
    copy[selected] += 1
    setPoints(copy)
    console.log(points)
    console.log(copy)
  }
  
  const Anecdote = () => {
    const next = Next
    console.log(next)
    setSelected(next)
  }
  
  const Next = () => Math.floor(Math.random() * anecdotes.length)
  return (
    <div>
      <>{Header()}</>
      <p>{anecdotes[selected]}</p>
      <p>has {points[selected]} votes</p>
      <button onClick = {AddOne}>vote</button>
      <button onClick = {Anecdote}>next anecdote</button>
      <MostVotes anecdotes={anecdotes} points = {points}/>

    </div>
  )
}

export default App