import { useState } from 'react'

const Filter = ({newSearch, handleSearchChange}) => {
  return (
   <div>
     filter shown with<input
     value = {newSearch}
     onChange= {handleSearchChange}
     />
   </div>
  )
}

const showPeople = ({peopleToShow}) => {
  return (
    peopleToShow.map(person => <Person key = {person.name} person = {person}/>)
  )
}

const Person = ({person}) => {
  return (
    <div>
      <p>{person.name} {person.number}</p>

    </div>
  )
}

const addPerson = ({newName, newNumber, handleNoteChange, handleNumChange, addNote}) => {
  return (
    <form onSubmit={addNote}>
        <div>
          name: <input 
          value = {newName} 
          onChange={handleNoteChange}
          />
        </div>
        <div>
          number: <input
          value = {newNumber}
          onChange={handleNumChange}
          />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
  )
}



const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456' },
    { name: 'Ada Lovelace', number: '39-44-5323523' },
    { name: 'Dan Abramov', number: '12-43-234345' },
    { name: 'Mary Poppendieck', number: '39-23-6423122' }
  ])
  const [newSearch, setNewSearch] = useState('')
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')

  const addNote = (event) => {
    event.preventDefault()
    console.log('button clicked', event.target)
    console.log(persons)
    persons.some(person => person.name === newName) 
    ? alert(`${newName} is already added to phonebook`)
    : setPersons(persons.concat({name: newName, number: newNumber}))
    
    setNewName('')
    setNewNumber('')
  }
  

  const handleNoteChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }
  const handleNumChange = (event) => {
    console.log(event.target.value)
    setNewNumber(event.target.value)
  }
  const handleSearchChange = (event) => {
    console.log(event.target.value)
    setNewSearch(event.target.value)
  }
  const peopleToShow = persons.filter(person => person.name.toLowerCase().includes(newSearch.toLowerCase()))

  return (
    <div>
      <h2>Phonebook</h2>
        <div>{Filter({newSearch, handleSearchChange})}</div>
      <h2>add a new</h2>
      <p>{addPerson({newName, newNumber, handleNoteChange, handleNumChange, addNote})}</p>
      <h3>Numbers</h3>
      <p>{showPeople({peopleToShow})}</p>
    </div>
  )

}

export default App