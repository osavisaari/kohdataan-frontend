import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import './styles.scss'

const StepButton = props => {
  const {
    params: { skippable, next, last },
    onClick,
  } = props

  return (
    <div className="step-button-container">
      {next && (
        <Link
          className={`${
            !skippable ? 'next-step-button-extra' : ''
          } next-step-button`}
          to={`/registration/${next}`}
          onClick={onClick}
        >
          Seuraava
        </Link>
      )}
      {skippable && next && (
        <Link className="skip-button" to={`/registration/${next}`}>
          ohita
        </Link>
      )}
      {last && (
        <Link
          className={`${
            !skippable ? 'next-step-button-extra' : ''
          } next-step-button`}
          to="/profiili"
          onClick={onClick}
        >
          Seuraava
        </Link>
      )}
      {skippable && last && (
        <Link className="skip-button" to="/profiili">
          ohita
        </Link>
      )}
    </div>
  )
}

StepButton.propTypes = {
  params: PropTypes.instanceOf(Object).isRequired,
  onClick: PropTypes.func.isRequired,
}

export default StepButton
