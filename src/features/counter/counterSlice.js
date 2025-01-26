import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  count: 0,
}

const counterSlice = createSlice({
  name: 'counter',
  initialState: initialState,
  reducers: {
    reset(state) {
      state.count = initialState.count
    },
    increment(state) {
      state.count += 1
    },
    decrement(state) {
      state.count -= 1
    },
    addBy(state, action) {
      state.count += action.payload
    },
  },
})

export const { reset, increment, decrement, addBy } = counterSlice.actions

export default counterSlice.reducer
