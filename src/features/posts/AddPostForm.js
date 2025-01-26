import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
// import { postAdded } from './postsSlice'
import { addNewPost } from './postsSlice'
import { selectAllUsers } from '../users/usersSlice'
import { useNavigate } from 'react-router-dom'

const AddPostForm = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [userId, setUserId] = useState('')

  const [addRequestStatus, setAddRequestStatus] = useState('idle')

  const users = useSelector(selectAllUsers)

  const onTitleChanged = (e) => setTitle(e.target.value)
  const onContentChanged = (e) => setContent(e.target.value)
  const onAuthorChanged = (e) => setUserId(e.target.value)

  //bez asyncThunk-a
  // const canSave = Boolean(title) && Boolean(content) && Boolean(userId)

  //sa asyncThunk-om
  const canSave =
    [title, content, userId].every(Boolean) && addRequestStatus === 'idle'

  const onSavePostClicked = () => {
    //bez asyncThunk-a
    // if (title && content) {
    //   dispatch(postAdded(title, content, userId))
    //   setTitle('')
    //   setContent('')
    // }

    //sa asyncThunk-om
    if (canSave) {
      try {
        setAddRequestStatus('pending')

        // createAsyncThunk will always return a resolved promise with either the 'fulfilled' action object, or 'rejected' action object inside

        // .unwrap() property which can be called to extract the payload of a 'fulfilled' action ... gde se izvrsava ono iz 'try' bloka, or to throw either the 'error' ... u kom slucaju ulazi u 'catch' blok

        //In one world,  .unwrap() helps you can catch the error which has been wraped by createAsyncThunk in your component
        dispatch(addNewPost({ title, body: content, userId })).unwrap()

        setTitle('')
        setContent('')
        setUserId('')
        navigate('/')
      } catch (err) {
        console.error('Failed to save the post', err)
      } finally {
        setAddRequestStatus('idle')
      }
    }
  }

  const usersOptions = users.map((user) => (
    <option key={user.id} value={user.id}>
      {user.name}
    </option>
  ))

  return (
    <section>
      <h2>Add a New Post</h2>

      <form>
        <label htmlFor='postTitle'>Post Title:</label>

        <input
          type='text'
          id='postTitle'
          name='postTitle'
          value={title}
          onChange={onTitleChanged}
        />

        <label htmlFor='postAuthor'>Author:</label>

        <select id='postAuthor' value={userId} onChange={onAuthorChanged}>
          <option value=''></option>

          {usersOptions}
        </select>

        <label htmlFor='postContent'>Content:</label>

        <textarea
          name='postContent'
          id='postContent'
          value={content}
          onChange={onContentChanged}
        />

        <button type='button' onClick={onSavePostClicked} disabled={!canSave}>
          Save Post
        </button>
      </form>
    </section>
  )
}

export default AddPostForm
