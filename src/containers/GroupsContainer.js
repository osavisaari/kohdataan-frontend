import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {
  loadMe as loadMeAction,
  getProfiles as getProfilesAction,
  getProfilesInChannel as getProfilesInChannelAction,
} from 'mattermost-redux/actions/users'
import {
  fetchMyChannelsAndMembers as fetchChannelsAndMembersAction,
  joinChannel as joinChannelAction,
} from 'mattermost-redux/actions/channels'
import PropTypes from 'prop-types'
import getChannelInvitationsAction from '../store/channels/channelAction'
import Groups from '../components/Groups'
import GroupSuggestions from '../components/GroupSuggestions'

const GroupsContainer = props => {
  const {
    channels,
    teams,
    loadMe,
    getProfiles,
    fetchMyChannelsAndMembers,
    users,
    currentUserId,
    myChannels,
    joinChannel,
    channelSuggestions,
    getChannelInvitations,
  } = props
  // Get user profiles and current user's teams at initial render
  useEffect(() => {
    getProfiles()
    loadMe()
    // TODO: Get channel suggestions from backend
    getChannelInvitations()
  }, [])

  // Get channels and members based on team id
  // & When user joins a channel, users props is changed and
  // channels need to be fetched again
  useEffect(() => {
    const teamId = Object.keys(teams)[0]
    if (teamId) {
      fetchMyChannelsAndMembers(teamId)
    }
  }, [teams, users])

  // Get only group channels (filter direct messages out)
  const getGroupChannels = allChannels => {
    const filteredChannels = Object.values(allChannels).filter(
      channel => channel.type !== 'D'
    )
    return filteredChannels
  }

  // Get channel objects based on myChannels
  const getChannelInfoForMyChannels = () => {
    const myCurrentChannels = Object.values(channels).filter(channel =>
      Object.keys(myChannels).includes(channel.id)
    )
    return myCurrentChannels
  }

  const handleJoinChannel = channelId => () => {
    const currentTeamId = Object.keys(teams)[0]
    joinChannel(currentUserId, currentTeamId, channelId).then(res =>
      console.log(res)
    )
  }

  const getFilteredChannelSuggestions = () => {
    // TODO: Filter out channels that user has is already joined
    const mySuggestions = channelSuggestions.filter(
      channel => !Object.keys(myChannels).includes(channel.id)
    )
    return mySuggestions
  }

  return (
    <>
      <GroupSuggestions
        channels={getFilteredChannelSuggestions()}
        handleJoinChannel={handleJoinChannel}
      />
      <Groups channels={getGroupChannels(getChannelInfoForMyChannels())} />
    </>
  )
}

GroupsContainer.propTypes = {
  channels: PropTypes.instanceOf(Object).isRequired,
  myChannels: PropTypes.instanceOf(Object).isRequired,
  teams: PropTypes.instanceOf(Object).isRequired,
  users: PropTypes.instanceOf(Object).isRequired,
  loadMe: PropTypes.func.isRequired,
  getProfiles: PropTypes.func.isRequired,
  fetchMyChannelsAndMembers: PropTypes.func.isRequired,
  joinChannel: PropTypes.func.isRequired,
  channelSuggestions: PropTypes.instanceOf(Array),
  currentUserId: PropTypes.string.isRequired,
  getChannelInvitations: PropTypes.func.isRequired,
}

GroupsContainer.defaultProps = {
  channelSuggestions: [],
}

const mapStateToProps = state => {
  const { currentUserId } = state.entities.users
  const { teams } = state.entities.teams
  const { channels } = state.entities.channels
  const { users } = state.entities
  const mmUser = users.profiles[currentUserId]
  const { profiles } = state.entities.users
  const { posts } = state.entities.posts
  const members = state.entities.channels.membersInChannel
  const myChannels = state.entities.channels.myMembers
  const { user } = state
  const channelSuggestions = state.channels.found

  return {
    currentUserId,
    channelSuggestions,
    users,
    user,
    mmUser,
    profiles,
    teams,
    posts,
    channels,
    members,
    myChannels,
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      fetchMyChannelsAndMembers: fetchChannelsAndMembersAction,
      getProfiles: getProfilesAction,
      getProfilesInChannel: getProfilesInChannelAction,
      loadMe: loadMeAction,
      joinChannel: joinChannelAction,
      getChannelInvitations: getChannelInvitationsAction,
    },
    dispatch
  )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GroupsContainer)
