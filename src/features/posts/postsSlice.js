import { createAsyncThunk, createSlice, nanoid } from '@reduxjs/toolkit'
import axios from 'axios'
import { sub } from 'date-fns'

//bez asyncThunk-a
// const initialState = [
//   {
//     id: '1',
//     title: 'Learning Redux Toolkit',
//     content: `I've heard good things.`,
//     date: sub(new Date(), { minutes: 10 }).toISOString(),
//     reactions: initialReactions,
//   },
//   {
//     id: '2',
//     title: 'Slices...',
//     content: 'The more I slice, the more I want pizza.',
//     date: sub(new Date(), { minutes: 5 }).toISOString(),
//     reactions: initialReactions,
//   },
// ]

const POSTS_URL = 'https://jsonplaceholder.typicode.com/posts'

//sa asyncThunk-om
const initialState = {
  posts: [],
  status: 'idle', //'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
}

const initialReactions = {
  thumbsUp: 0,
  wow: 0,
  heart: 0,
  rocket: 0,
  coffee: 0,
}

// prvi parametar unutar createAsyncThunk-a je ime slice-a i ime funkcije, a drugi je async funkcija
export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
  const response = await axios.get(POSTS_URL)
  return response.data
})

export const addNewPost = createAsyncThunk(
  'posts/addNewPost',
  async (initialPost) => {
    const response = await axios.post(POSTS_URL, initialPost)
    return response.data
  }
)

export const updatePost = createAsyncThunk(
  'posts/updatePost',
  async (initialPost) => {
    const { id } = initialPost

    try {
      const response = await axios.put(`${POSTS_URL}/${id}`, initialPost)

      return response.data
    } catch (err) {
      return err.message
    }
  }
)

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    postAdded: {
      reducer(state, action) {
        //bez asyncThunk-a
        // state.push(action.payload)

        //sa asyncThunk-om
        state.posts.push(action.payload)
      },
      prepare(title, content, userId) {
        return {
          payload: {
            id: nanoid(),
            title,
            content,
            date: new Date().toISOString(),
            userId,
            reactions: initialReactions,
          },
        }
      },
    },
    reactionAdded(state, action) {
      const { postId, reaction } = action.payload
      //bez asyncThunk-a
      // const existingPost = state.find((post) => post.id === postId)

      //sa asyncThunk-om
      const existingPost = state.posts.find((post) => post.id === postId)

      if (existingPost) {
        existingPost.reactions[reaction]++
      }
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchPosts.pending, (state, action) => {
        state.status = 'loading'
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = 'succeeded'
        //Adding date and reactions
        let min = 1

        const loadedPosts = action.payload.map((post) => {
          post.date = sub(new Date(), { minutes: min++ }).toISOString()
          post.reactions = initialReactions
          return post
        })

        //Add any fetched posts to the array
        state.posts = state.posts.concat(loadedPosts)
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
      .addCase(addNewPost.fulfilled, (state, action) => {
        action.payload.userId = Number(action.payload.userId)
        action.payload.date = new Date().toISOString()
        action.payload.reactions = initialReactions

        console.log(action.payload)

        state.posts.push(action.payload)
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        if (!action.payload?.id) {
          console.log('Update could not complete')
          console.log(action.payload)
          return
        }

        const { id } = action.payload

        action.payload.date = new Date().toISOString()

        const posts = state.posts.filter((post) => post.id !== id)

        state.posts = [...posts, action.payload]
      })
  },
})

// SELECTORS

//bez asyncThunk-a
// export const selectAllPosts = (state) => state.posts

//sa asyncThunk-om
export const selectAllPosts = (state) => state.posts.posts
export const getPostsStatus = (state) => state.posts.status
export const getPostsError = (state) => state.posts.error

export const selectPostById = (state, postId) =>
  state.posts.posts.find((post) => post.id === postId)

export const { postAdded, reactionAdded } = postsSlice.actions

export default postsSlice.reducer
