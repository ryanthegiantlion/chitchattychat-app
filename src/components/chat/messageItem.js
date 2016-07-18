'use strict';
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';

var moment = require('moment');

export default class MessageItem extends Component {
  constructor(props) {
    super(props)
    this.state = {displayTimeElapsed: false}
  }

  formatDate(date)
  {
    return moment(date).format('MMMM Do, h:mm');
  }

  onDeliveryClick()
  {
    this.setState({displayTimeElapsed: true});
  }

  render() {
    let sentIcon = undefined;
    let deliveredIcon = undefined
    let timeElapsed = undefined
    if (this.props.isSent) {
      sentIcon = <Icon style={styles.sentIcon} name={'check'} />
    }
    if (this.props.isDelivered) {
      deliveredIcon = <TouchableOpacity onPress={() => this.onDeliveryClick()}><Icon style={styles.deliveredIcon} name={'check'} /></TouchableOpacity>
      if (this.state.displayTimeElapsed) {
        timeElapsed = <Text>{this.props.timeElapsed}</Text>
      }
    }
    return (
      <View style={styles.messageContainer}>
        <View style={styles.nameAndTimestampContainer}>
          <Text style={styles.name}>{this.props.senderName}</Text>
          <Text style={styles.timestamp}>{this.formatDate(this.props.timestamp)}</Text>
          {sentIcon}
          {deliveredIcon}
          {timeElapsed}
        </View>
        <Text>
          {this.props.text}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  messageContainer: {
    marginTop: 12,
  },
  nameAndTimestampContainer: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  name: {
    fontWeight: '500',
    fontSize: 14,
  },
  timestamp: {
    marginLeft: 20,
    color: '#666',
    fontSize: 12,
  },
  sentIcon: {
    color: 'green',
    marginLeft: 10,
    fontSize: 12,
  },
  deliveredIcon: {
    color: 'green',
    fontSize: 12,
  }
});