import React, { useState, useEffect } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'  
import personService from './services/PersonsService'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [successMessage, setSuccessMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    console.log('effect')
    personService
    .getAll()
    .then((initialPersons) => {
      setPersons(initialPersons)
    })
  }, [])

  const addClickHandler = (event) => {
    event.preventDefault()
    const person = persons.find(e => e.name === newName)
    if (person) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old numbeer with new one?`)) {
        personService
        .update(person.id, {name: newName, number: newNumber})
        .then((updatedPerson) => {
          setPersons(persons.map(person => person.name !== newName ? person : updatedPerson))
          setSuccessMessage(
            `Edited ${newName} with new number ${newNumber}`
          )
          setTimeout(() => {
            setSuccessMessage(null)
          }, 5000)
        })
        .catch((error) => {
          console.log(error.response)
          setErrorMessage(
            `Information of '${newName}' was already removed from server`
          )
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
        })
      setNewName('')
      setNewNumber('')
      }
    } else {
      personService
      .create({name: newName, number: newNumber})
      .then((newPerson) => {
        setPersons(persons.concat(newPerson))
        setSuccessMessage(
          `Added ${newName}`
        )
        setTimeout(() => {
          setSuccessMessage(null)
        }, 5000)
      })
      
      setNewName('')
      setNewNumber('')
    }
  }

  const filterHandler = (event) => {
    setFilter(event.target.value)
  }

  const Notification = ({ message }) => {
    if (message === null) {
      return null
    }
  
    return (
      <div className="success">
        {message}
      </div>
    )
  }

  const FailNotification = ({ message }) => {
    if (message === null) {
      return null
    }
  
    return (
      <div className="error">
        {message}
      </div>
    )
  }

  const deleteHandler = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      personService
      .del(id)
      .then(() => {
        setPersons(persons.filter(e => e.id !== id))
      })
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={successMessage} />
      <FailNotification message={errorMessage} />
      <Filter filter={filter} filterHandler={filterHandler}/>
      <h2>Add a new</h2>
      <PersonForm newName={newName} setNewName={setNewName} newNumber={newNumber} setNewNumber={setNewNumber} clickHandler={addClickHandler} />

      <h2>Numbers</h2>
      <Persons persons={persons} filter={filter} deleteHandler={deleteHandler} />
    </div>
  )
}

export default App