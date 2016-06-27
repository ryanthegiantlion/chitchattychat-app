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
    //return date.getHours() + ':' + date.getMinutes();
    return moment(date).format('MMMM Do, h:mm');
  }

  onReceiptClick()
  {
    this.setState({displayTimeElapsed: true});
  }

  render() {
    //console.log(this.props);
    let icon = undefined;
    let receiptIcon = undefined
    let timeElapsed = undefined
    if (this.props.isDelivered) {
      icon = <Icon style={styles.deliveredIcon} name={'check'} />
    }
    if (this.props.isReceived) {
      receiptIcon = <TouchableOpacity onPress={() => this.onReceiptClick()}><Icon style={styles.receiptIcon} name={'check'} /></TouchableOpacity>
      if (this.state.displayTimeElapsed) {
        timeElapsed = <Text>{this.props.timeElapsed}</Text>
      }
    }
    return (
      <View style={styles.messageContainer}>
        <View style={styles.nameAndTimestampContainer}>
          <Text style={styles.name}>{this.props.senderName}</Text>
          <Text style={styles.timestamp}>{this.formatDate(this.props.timestamp)}</Text>
          {icon}
          {receiptIcon}
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
  deliveredIcon: {
    color: 'green',
    marginLeft: 10,
    fontSize: 12,
  },
  receiptIcon: {
    color: 'green',
    fontSize: 12,
  }
});