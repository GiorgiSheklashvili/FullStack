import React from 'react'
import Course from './components/Course'

const Total = ({ course: {parts} }) => { 
  const total = parts.reduce((s, p) => s + p.exercises, 0)
  return(
    <b><p>total of {total} exercises</p></b>
  )
}

const App = () => {
  const courses = [
    {
      name: 'Half Stack application development',
      id: 1,
      parts: [
        {
          name: 'Fundamentals of React',
          exercises: 10,
          id: 1
        },
        {
          name: 'Using props to pass data',
          exercises: 7,
          id: 2
        },
        {
          name: 'State of a component',
          exercises: 14,
          id: 3
        },
        {
          name: 'Redux',
          exercises: 11,
          id: 4
        }
      ]
    }, 
    {
      name: 'Node.js',
      id: 2,
      parts: [
        {
          name: 'Routing',
          exercises: 3,
          id: 1
        },
        {
          name: 'Middlewares',
          exercises: 7,
          id: 2
        }
      ]
    }
  ]

  return (
    <div>
      {courses.map((course) => {
        return(
        <div>
          <Course course={course} />
          <Total course={course}/>
        </div>
      )
      })}
    </div>
  )
}

export default App