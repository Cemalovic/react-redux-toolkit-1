import { useDispatch, useSelector } from 'react-redux'
import { reset, increment, decrement, addBy } from './counterSlice'
import { useState } from 'react'
import './Counter.css'

const Counter = () => {
  const counter = useSelector((state) => state.counter.count)
  const dispatch = useDispatch()

  const [incrementAmount, setIncrementAmount] = useState(0)

  const addValue = Number(incrementAmount) || 0

  const res = () => {
    setIncrementAmount(0)
    dispatch(reset())
  }

  const increm = () => {
    dispatch(increment())
  }

  const decrem = () => {
    dispatch(decrement())
  }

  const addByAmount = () => {
    dispatch(addBy(addValue))
  }

  return (
    <section>
      <h1>Counter App</h1>
      <p className='p'> {counter} </p>

      <div>
        <button onClick={increm}>Increment</button>
        <button onClick={decrem}>Decrement</button>
      </div>

      <input
        type='text'
        value={incrementAmount}
        onChange={(e) => setIncrementAmount(e.target.value)}
      />

      <div>
        <button onClick={addByAmount}>Add Amount</button>
        <button onClick={res}>Reset</button>
      </div>
    </section>
  )
}

export default Counter
