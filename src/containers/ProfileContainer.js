import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {
  getMe as getMeAction,
  getProfilesByUsernames as getProfilesByUsernamesAction,
} from 'mattermost-redux/actions/users'
import PropTypes from 'prop-types'
import {
  addUserInterests as addUserInterestsAction,
  getUserInterests as getUserInterestsAction,
  updateUser as updateUserAction,
} from '../store/user/userAction'
import getInterests from '../store/interest/interestAction'
import Profile from '../components/Profile'

const ProfileContainer = props => {
  // mattermost user
  const {
    currentUser,
    username,
    getProfilesByUsernames,
    getMe,
    userInterests,
    interestOptions,
    addUserInterests,
    getUserInterests,
    updateUser,
    myUserInfo,
  } = props
  const [mmuser, setmmUser] = useState({})
  // TODO: Get other user's interests for other user profile
  // const [interests, setInterests] = useState([])
  useEffect(() => {
    getMe()
    props.getInterests()
  }, [])

  useEffect(() => {
    if (username) {
      getProfilesByUsernames([username]).then(data => setmmUser(data.data[0]))
      // TODO: Get other users info from node backend (interests, location, description)
    } else {
      setmmUser(currentUser)
      getUserInterests()
    }
  }, [username, currentUser])

  return (
    <Profile
      user={mmuser}
      currentUser={currentUser}
      userInterests={userInterests}
      interestOptions={interestOptions}
      addUserInterests={addUserInterests}
      myUserInfo={myUserInfo}
      updateUser={updateUser}
    />
  )
}

const mapStateToProps = (state, ownProps) => {
  const { currentUserId } = state.entities.users
  const { username } = ownProps.match.params
  const currentUser = state.entities.users.profiles[currentUserId]
  const userInterests = state.user.Interest
  const interestOptions = state.interests.results
  const myUserInfo = state.user

  return {
    currentUserId,
    currentUser,
    username,
    userInterests,
    interestOptions,
    myUserInfo,
  }
}

ProfileContainer.propTypes = {
  getMe: PropTypes.func.isRequired,
  currentUser: PropTypes.instanceOf(Object),
  username: PropTypes.string,
  myUserInfo: PropTypes.instanceOf(Object).isRequired,
  getProfilesByUsernames: PropTypes.func.isRequired,
  userInterests: PropTypes.instanceOf(Array),
  interestOptions: PropTypes.instanceOf(Array),
  getInterests: PropTypes.func.isRequired,
  addUserInterests: PropTypes.func.isRequired,
  getUserInterests: PropTypes.func.isRequired,
  updateUser: PropTypes.func.isRequired,
}

ProfileContainer.defaultProps = {
  currentUser: {},
  username: '',
  userInterests: [],
  interestOptions: [],
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getMe: getMeAction,
      getProfilesByUsernames: getProfilesByUsernamesAction,
      addUserInterests: addUserInterestsAction,
      getUserInterests: getUserInterestsAction,
      updateUser: updateUserAction,
      getInterests,
    },
    dispatch
  )

// export default GroupsContainer
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProfileContainer)
