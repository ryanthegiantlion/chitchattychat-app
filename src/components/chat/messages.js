'use strict';
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ListView
} from 'react-native';

import MessageItem from './messageItem'

import InvertibleScrollView from 'react-native-invertible-scroll-view';

export default class Messages extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
  }

  render() {
    // TODO. Change to props
    return (
      <View style={styles.messagesContainer}>
        <ListView
          enableEmptySections={true}
          renderScrollComponent={props => <InvertibleScrollView {...props} inverted />}
          style={styles.listView}
          dataSource={this.props.messages}
          renderRow={(rowData, sectionID, rowID) => <MessageItem 
            key={`${sectionID}-${rowID}`} 
            senderName={rowData.senderName} 
            body={rowData.body} 
            timeElapsed={rowData.timeElapsed}
            timestamp={rowData.timestamp} 
            isDelivered={rowData.isDelivered}
            isSent={rowData.isSent}/>}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  messagesContainer: {
    flex: 1,
  },

  listView: {
    flex: 1,
  },
});