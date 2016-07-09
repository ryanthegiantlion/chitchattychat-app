'use strict';
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';

export default class ChannelItem extends Component {

    render() {
      let linkStyles = [styles.channelLink]
      let iconStyles = styles.offlineIcon
      let textStyles = [styles.channelName]
      let icon = 'circle-o';
      let isTypingText = undefined
      if (this.props.isSelected) {
        if (this.props.isOnline) {
          icon = 'circle';
          iconStyles = styles.onlineSelectedIcon
          linkStyles.push(styles.selected)
          textStyles.push(styles.onlineSelectedIcon)
        }
        else {
          linkStyles.push(styles.selected)
          textStyles.push(styles.onlineSelectedIcon)
        }
      }
      else {
        if (this.props.isOnline) {
          icon = 'circle';
          iconStyles = styles.onlineIcon
        }
        if (this.props.hasUnreadMessages) {
          textStyles.push(styles.unreadMessages)
        }
      }

      if (this.props.isTyping) {
        isTypingText = <Text style={styles.isTypingText}>...</Text>
      }
      
      return (
        <View style={styles.channelContinaer}>
          <TouchableOpacity style={linkStyles} onPress={() => this.props.onSelect(this.props._id, this.props.userName)}>
            <Icon style={iconStyles} name={icon} size={16}/>
            <Text style={textStyles}>{this.props.userName}</Text>
            {isTypingText}
          </TouchableOpacity>
        </View>
      );
    }
}

const styles = StyleSheet.create({
  channelContainer: {

  },
  channelLink: {
    flexDirection: 'row',
    padding: 6,
  },
  channelName: {
    color: '#a999a7',
    marginLeft: 4,
  },
  onlineSelectedIcon: {
    color: '#eee',
  },
  offlineIcon: {
    color: '#a999a7',
  },
  onlineIcon: {
    color: '#4f9689',
  },
  unreadMessages: {
    fontWeight: 'bold',
    color: '#eee',
  },
  selected: {
    backgroundColor: '#4f9689',
  },
  isTypingText: {
    marginLeft: 10,
    color: 'white',
  },
});