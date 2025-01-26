import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { selectPostById, updatePost } from './postsSlice'
import { selectAllUsers } from '../users/usersSlice'

const EditPostForm = () => {
  // retreve postId from React Router
  const { postId } = useParams()

  const navigate = useNavigate()

  const dispatch = useDispatch()

  const post = useSelector((state) => selectPostById(state, Number(postId)))
  const users = useSelector(selectAllUsers)

  const [title, setTitle] = useState(post?.title)
  const [content, setContent] = useState(post?.body)
  const [userId, setUserId] = useState(post?.userId)

  const [requestStatus, setRequestStatus] = useState('idle')

  if (!post) {
    return (
      <section>
        <h2>Post not found!</h2>
      </section>
    )
  }

  const onTitleChanged = (e) => setTitle(e.target.value)
  const onContentChanged = (e) => setContent(e.target.value)
  const onAuthorChanged = (e) => setUserId(+e.target.value)

  //sa asyncThunk-om
  const canSave =
    [title, content, userId].every(Boolean) && requestStatus === 'idle'

  const onSavePostClicked = () => {
    //sa asyncThunk-om
    if (canSave) {
      try {
        setRequestStatus('pending')
        dispatch(
          updatePost({
            id: post.id,
            title,
            body: content,
            userId,
            reactions: post.reactions,
          })
        ).unwrap()

        setTitle('')
        setContent('')
        setUserId('')
        navigate(`/post/${postId}`)
      } catch (err) {
        console.error('Failed to save the post', err)
      } finally {
        setRequestStatus('idle')
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
      <h2>Edit Post</h2>

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

        <select
          name='postAuthor'
          id='postAuthor'
          defaultValue={userId}
          onChange={onAuthorChanged}
        >
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

export default EditPostForm
