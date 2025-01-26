import { useDispatch } from 'react-redux'
import { reactionAdded } from './postsSlice'

const reactionEmoji = {
  thumbsUp: '👍',
  wow: '😲',
  heart: '❤️',
  rocket: '🚀',
  coffee: '☕',
}

const ReactionButtons = ({ post }) => {
  const dispatch = useDispatch()

  const onReactionButtonClick = (name) => {
    dispatch(reactionAdded({ postId: post.id, reaction: name }))
  }

  // u ovom slucaju ('name' === key), a ('emoji' === value) i posto ih u 'reactionEmoji' objektu ima vise, stavljeni su u niz i mapira se po njima sa Object.entries(reactionEmoji)
  const reactionButtons = Object.entries(reactionEmoji).map(([name, emoji]) => {
    return (
      <button
        key={name}
        type='button'
        className='reactionButton'
        onClick={() => onReactionButtonClick(name)}
      >
        {emoji} {post.reactions[name]}
      </button>
    )
  })

  return <div>{reactionButtons}</div>
}

export default ReactionButtons
