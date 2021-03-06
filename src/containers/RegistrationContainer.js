import React, { useState } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { uploadProfileImage } from 'mattermost-redux/actions/users'
import PropTypes from 'prop-types'
import RegistrationTitle from '../components/RegistrationFlow/RegistrationTitle'
import pages from '../contants/registrationPages'
import StepButton from '../components/RegistrationFlow/StepButton'
import Container from '../components/Container'
import InfoPage from '../components/RegistrationFlow/InfoPage'
import Nickname from '../components/RegistrationFlow/Nickname'
import Description from '../components/RegistrationFlow/Description'
import Picture from '../components/RegistrationFlow/Picture'
import Location from '../components/RegistrationFlow/Location'
import Interests from '../components/RegistrationFlow/Interests'
import dataUriToBlob from '../utils/dataUriToBlob'
import { updateUser, addUserInterests } from '../store/user/userAction'
import getInterestsAction from '../store/interest/interestAction'
import ErrorNotification from '../components/RegistrationFlow/ErrorNotification'

const RegistrationContainer = props => {
  const {
    match: {
      params: { step },
    },
    mattermostId,
    interestOptions,
    registrationError,
  } = props
  const [nickname, setNickname] = useState('')
  const [location, setLocation] = useState('')
  const [description, setDescription] = useState('')
  const [img, setImg] = useState(null)
  const [interests, setInterests] = useState([])

  const subpage = () => {
    switch (step) {
      case pages.info.current:
        return <InfoPage />
      case pages['add-nickname'].current:
        return (
          <Nickname
            value={nickname}
            onChange={e => {
              setNickname(e.target.value)
            }}
          />
        )
      case pages['add-location'].current:
        return (
          <Location onChange={value => setLocation(value)} value={location} />
        )
      case pages['add-description'].current:
        return (
          <Description
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
        )
      case pages['add-image'].current:
        return <Picture onChange={p => setImg(p)} />
      case pages['add-interests'].current:
        return (
          <Interests
            options={interestOptions}
            interests={interests}
            setInterests={setInterests}
          />
        )
      default:
        return undefined
    }
  }

  const stepButtonActions = () => {
    switch (step) {
      case pages['add-nickname'].current: {
        return props.updateUser({ nickname, mmid: mattermostId })
      }
      case pages['add-location'].current: {
        return props.updateUser({ location: location.value })
      }
      case pages['add-description'].current: {
        return props.updateUser({ description })
      }
      case pages['add-image'].current: {
        return props.uploadProfileImage(mattermostId, dataUriToBlob(img))
      }
      case pages['add-interests'].current: {
        console.log(`add-interests ${interests}`)
        return props.addUserInterests({ userInterests: interests })
      }
      default:
        return undefined
    }
  }

  return (
    <Container className="registration-container">
      {step !== pages['add-interests'].current && <RegistrationTitle />}
      {subpage()}
      {!registrationError && (
        <StepButton params={pages[step]} onClick={stepButtonActions} />
      )}
      {registrationError && (
        <ErrorNotification errorMessage={registrationError} />
      )}
    </Container>
  )
}

RegistrationContainer.propTypes = {
  match: PropTypes.instanceOf(Object).isRequired,
  updateUser: PropTypes.func.isRequired,
  mattermostId: PropTypes.string.isRequired,
  uploadProfileImage: PropTypes.func.isRequired,
  interestOptions: PropTypes.instanceOf(Array),
  registrationError: PropTypes.string,
  addUserInterests: PropTypes.func.isRequired,
}

RegistrationContainer.defaultProps = {
  registrationError: null,
  interestOptions: [],
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      updateUser,
      uploadProfileImage,
      addUserInterests,
      getInterestsAction,
    },
    dispatch
  )

const mapStateToProps = state => {
  return {
    mattermostId: state.entities.users.currentUserId,
    interestOptions: state.interests.results,
    registrationError: state.user.errorMessage,
  }
}

// export default App
export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(RegistrationContainer)
)
