import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  selectAllPosts,
  getPostsStatus,
  getPostsError,
  fetchPosts,
} from './postsSlice'
import PostsExcerpt from './PostsExcerpt'

const PostsList = () => {
  const posts = useSelector(selectAllPosts)
  const postsStatus = useSelector(getPostsStatus)
  const error = useSelector(getPostsError)

  // const dispatch = useDispatch()

  // useEffect(() => {
  //   if (postsStatus === 'idle') {
  //     dispatch(fetchPosts())
  //   }
  // }, [postsStatus, dispatch])

  let content

  if (postsStatus === 'loading') {
    content = <p>"Loading..."</p>
  } else if (postsStatus === 'succeeded') {
    // sa metodom .sotr() obrce redosled u zavisnosti od datuma/vremena objave
    // sa metodom .slice() kreira (plitku) kopiju niza
    const orderedPosts = posts
      .slice()
      .sort((a, b) => b.date.localeCompare(a.date))

    content = orderedPosts.map((post, index) => (
      <PostsExcerpt key={index} post={post} />
    ))
  } else if (postsStatus === 'failed') {
    content = <p> {error} </p>
  }

  return <section>{content}</section>
}

export default PostsList
