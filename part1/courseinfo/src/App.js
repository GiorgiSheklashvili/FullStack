import React from 'react'

const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }
  
  const Header = (props) => (
      <h1>{props.name}</h1>
  )
  const Content = (props) => (
    <>
       <Part part={props.course.parts[0].name} exercise={props.course.parts[0].exercises} />
       <Part part={props.course.parts[1].name} exercise={props.course.parts[1].exercises} />
       <Part part={props.course.parts[2].name} exercise={props.course.parts[2].exercises} />
    </>
  )
  const Total = (props) => (
    <p>Number of exercises {props.course.parts[0].exercises + props.course.parts[1].exercises + props.course.parts[2].exercises}</p>
  )

  const Part = (props) => (
    <p>
      {props.part} {props.exercise}
    </p>
  )

  return (
    <div>
      <Header course={course} />
      <Content course={course}/>
      <Total course={course} />
    </div>
  )
}

export default App