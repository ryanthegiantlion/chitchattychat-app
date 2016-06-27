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
    //let messages = [{'id':1},{'id':2},{'id':3},{'id':4},{'id':5},{'id':6},{'id':7},{'id':8},{'id':9},{'id':10},{'id':11},{'id':12},{'id':13},{'id':14},{'id':15}]
    //let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
    //console.log('sdfjhsdjfhsdjfhsdjfhsjdhf');
    //console.log(props)
    //let currentMessages = props.messages || 
    //this.state = {messages:ds.cloneWithRows(props.messages)}
  }

  componentDidMount() {
    //console.log('aaaaaaaaaaaaaaa');
    //console.log(this.props)
  }

  render() {
    // TODO. Change to props
    //var messages = this.state.messages.map((item) => <MessageItem)
    // The enableEmptySections is to get rid an a useless warning
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
            text={rowData.text} 
            timeElapsed={rowData.timeElapsed}
            timestamp={rowData.timestamp} 
            isDelivered={rowData.isDelivered}
            isReceived={rowData.isReceived}/>}/>
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