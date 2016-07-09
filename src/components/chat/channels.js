'use strict';
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

import ChannelItem from './channelItem'

export default class Channels extends Component {
  constructor() {
    super()
  }

  componentDidMount() {
  }

  render() {
    // TODO. Change to props
    var users = this.props.users.map((item) => <ChannelItem 
      onSelect={this.props.onDirectMessageSelect}
      type='DirectMessage'
      key={item._id}
      _id={item._id} 
      userName={item.userName} 
      isOnline={item._id in this.props.onlineUsers}
      isTyping={this.props.typingUsers[item._id]}
      isSelected={this.props.ui.selectedChannel.id == item._id}
      hasUnreadMessages={this.props.unreadUsers[item._id]}/>)
    return (
      <TouchableOpacity style={styles.overlay} onPress={() => this.props.setMenuVisibility(false)}>
        <View style={styles.overlayInnerWrapper}>
          <ScrollView style={styles.channelsContainer}>
            <View style={styles.channelHeadingWrapper}>
              <Text style={styles.channelHeading}>CHANNELS</Text>
            </View>
              <ChannelItem 
                onSelect={this.props.onChannelSelect}
                userName='General'
                type='Channel'
                _id={0}
                isSelected={this.props.ui.selectedChannel.id == 0}
                hasUnreadMessages={this.props.unreadUsers['0']}/>
            <View style={[{marginTop: 16},styles.channelHeadingWrapper]}>
              <Text style={styles.channelHeading}>DIRECT MESSAGES</Text>
            </View>
            {users}
          </ScrollView>
          <View style={styles.placeholder}>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    left: 0,
    right: 0,
  },
  overlayInnerWrapper: {
    flex: 1,
    flexDirection: 'row',
  },
  channelsContainer: {
    backgroundColor: '#4d394b',
    flex: 3,
  },
  channelHeadingWrapper: {
    borderBottomWidth: 1,
    borderBottomColor: '#3e313c',
  },
  channelHeading: {
    color: '#a999a7',
    margin: 6,
  },
  placeholder: {
    flex: 1,
  }
});