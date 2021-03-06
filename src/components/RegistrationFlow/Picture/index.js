import React from 'react'
import Avatar from 'react-avatar-edit'
import PropTypes from 'prop-types'
import './styles.scss'

const Picture = props => {
  const { onChange } = props

  return (
    <div className="add-user-picture-container">
      <h3 className="add-user-picture-title">Valitse oma kuvake</h3>
      <Avatar
        width={200}
        height={200}
        label="Valitse tiedosto"
        onCrop={onChange}
      />
    </div>
  )
}

Picture.propTypes = {
  onChange: PropTypes.func.isRequired,
}

export default Picture
