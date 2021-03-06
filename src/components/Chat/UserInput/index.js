import React, { useState } from 'react'
import TextareaAutosize from 'react-autosize-textarea'
import PropTypes from 'prop-types'
import './styles.scss'

const UserInput = props => {
  const { createPost, channel } = props
  const [message, setMessage] = useState('')

  const handleSubmit = e => {
    e.preventDefault()
    const post = {
      channel_id: channel.id,
      message,
    }
    createPost(post)
    setMessage('')
  }

  const handleChange = e => {
    setMessage(e.target.value)
  }

  return (
    <div className="chat-user-input-wrapper">
      <form onSubmit={handleSubmit} className="chat-user-input-content">
        <TextareaAutosize
          className="chat-user-input-text-field"
          id="message"
          type="text"
          value={message}
          onChange={handleChange}
          placeholder="Kirjoita viesti"
          maxRows={3}
          rows={1}
        />
        <input type="submit" value="➤" className="send-message-button" />
      </form>
    </div>
  )
}

UserInput.propTypes = {
  createPost: PropTypes.func.isRequired,
  channel: PropTypes.instanceOf(Object).isRequired,
}

export default UserInput
