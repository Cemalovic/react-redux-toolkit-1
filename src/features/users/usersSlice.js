import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

//bez asyncThunk-a
// const initialState = [
//   {
//     id: '0',
//     name: 'Dude Lebowski',
//   },
//   {
//     id: '1',
//     name: 'Neil Young',
//   },
//   {
//     id: '2',
//     name: 'Milos Cemalovic',
//   },
// ]

const USERS_URL = 'https://jsonplaceholder.typicode.com/users'

//sa asyncThunk-om
const initialState = []

// createAsyncThunk will always return a resolved promise with either the 'fulfilled' action object, or 'rejected' action object inside

// prvi parametar unutar createAsyncThunk-a je ime slice-a i ime funkcije, a drugi je async funkcija
export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
  try {
    const response = await axios.get(USERS_URL)

    return response.data
  } catch (err) {
    return err.message
  }
})

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(fetchUsers.fulfilled, (state, action) => {
      return action.payload
    })
  },
})

export const selectAllUsers = (state) => state.users

export default usersSlice.reducer
