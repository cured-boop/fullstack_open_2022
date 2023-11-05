const Header = ({name}) => {
  console.log(name)
  return (
    <div>
      <h2>{name}</h2>
    </div>
  )
}
const Content = ({parts}) =>{
  console.log(parts)
  const total = parts.reduce((sum, part) => sum + part.exercises, 0);
  console.log(total)
  return (
    <div>
      {parts.map(part => <Part key ={part.id} part={part}/>)}
      <strong>total of {total} exercises</strong>
    </div>
  )
}
const Part = ({part}) =>{
  return (
    <div>
      <p>{part.name} {part.exercises}</p>
    </div>
  )
}
const Course = ({course}) => {
  return (
    <div>
      <Header name = {course.name}/>
      <Content parts = {course.parts}/>
    </div>
  )
}
export default Course