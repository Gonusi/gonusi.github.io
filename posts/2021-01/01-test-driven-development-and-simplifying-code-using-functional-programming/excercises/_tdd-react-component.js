// http://localhost:8000/react-dev-demos/day1
import React, { useState } from "react"

// Refactored from class:
/* 
export class Counter extends React.Component {
  constructor() {
    super()
    this.increment = this.increment.bind(this)
    this.state = {
      count: 0,
    }
  }

  increment() {
    this.setState({
      count: this.state.count + 1,
    })
  }

  render() {
    return (
      <>
        <span data-testid="count">Count: {this.state.count}</span>
        <button type="button" onClick={this.increment}>
          Increment
        </button>
      </>
    )
  }
}
*/

// To functional component:

export const Counter = () => {
  const [count, setCount] = useState(0)

  const increment = () => {
    setCount(count + 1)
  }

  return (
    <>
      <span data-testid="count">Count: {count}</span>
      <button type="button" onClick={increment}>
        Increment
      </button>
    </>
  )
}

export default function Day1() {
  return Counter
}
