'use strict';
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ListView,
  Dimensions,
  DeviceEventEmitter
} from 'react-native';

import { connect } from 'react-redux'

import Icon from 'react-native-vector-icons/FontAwesome';

window.navigator.userAgent = "react-native";

var io = require('socket.io-client/socket.io');

// TODO: A lot of these are no longer being used
import {
  selectChannel,
  selectDirectMessage,
  changeRoute, 
  setChannelMenuVisibility, 
  loadUsers, 
  fetchAndSyncUsers,
  updateOnlineUsers,
  updateTypingUsers,
  storeAndAddMessages,
  confirmMessage,
  confirmReceiptMessages,
  addMessages,
  updatelastReadTimestamp,
  persistCurrentSession,
  addChatReadStatus,
  removeSession,
  startChat,
  newMessage,
  setTypingStatus,
} from '../../store/actions'

import Messages from './messages'
import Channels from './channels'


class Chat extends Component {

    constructor(props) {
      super(props)
      this.state = {
        newMessageText: '',
        visibleHeight: Dimensions.get('window').height,
        height: 0
      };

      this.isTyping = false;
      this.typingTimeoutFunc = undefined;
    }

    componentDidMount() {
      DeviceEventEmitter.addListener('keyboardWillShow', this.keyboardWillShow.bind(this))
      DeviceEventEmitter.addListener('keyboardWillHide', this.keyboardWillHide.bind(this))
      this.props.onMount();
    }

    componentWillUnmount() {
      // TODO: we need to fir this off as an action
      //this.socket.disconnect();
    }

     keyboardWillShow (e) {
      let newSize = Dimensions.get('window').height - e.endCoordinates.height
      this.setState({visibleHeight: newSize})
    }

    keyboardWillHide (e) {
      this.setState({visibleHeight: Dimensions.get('window').height})
    }

    guid() {
      function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
          .toString(16)
          .substring(1);
      }
      return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
    }

    sendMessage() {
      clearTimeout(this.typingTimeoutFunc);
      this.clearTypingIndicator();
      var selectedChannel = this.props.ui.selectedChannel;
      var messageData = {
        chatId: selectedChannel.id,
        clientStartTime: new Date(),
        type: selectedChannel.type, 
        text: this.state.newMessageText, 
        senderName: this.props.session.username, 
        receiverId: selectedChannel.id, 
        clientMessageIdentifier: this.guid()};
      this.setState({newMessageText: '', height: 0})
      messageData.senderId = selectedChannel.id;
      this.props.onMessageSend(messageData);
    }

    clearTypingIndicator() {
      this.isTyping = false;
      this.props.onChangeTypingStatus({ isTyping: false, receiverId: this.props.ui.selectedChannel.id });
    }

    onNewMessageTextChange(event) {
      if (this.props.ui.selectedChannel.type == 'DirectMessage') {
        if (!this.isTyping) {
          this.props.onChangeTypingStatus({ isTyping: true, receiverId: this.props.ui.selectedChannel.id });
          this.isTyping = true;
          this.typingTimeoutFunc = setTimeout(() => this.clearTypingIndicator(), 2000);
        }
        else {
          clearTimeout(this.typingTimeoutFunc);
          this.typingTimeoutFunc = setTimeout(() => this.clearTypingIndicator(), 2000);
        }
      }

      this.setState({
        newMessageText: event.nativeEvent.text,
        height: event.nativeEvent.contentSize.height,
      });
    }

    render() {
      var channels = undefined
      var isTyping = undefined
      if (this.props.ui.isMenuVisible) {
        channels = <Channels 
          ui={this.props.ui}
          onDirectMessageSelect={this.props.onDirectMessageSelect}
          onChannelSelect={this.props.onChannelSelect}
          setMenuVisibility={this.props.setMenuVisibility}
          channels={this.props.channels} 
          users={this.props.users}
          onlineUsers={this.props.onlineUsers}
          unreadUsers={this.props.unreadUsers}
          typingUsers={this.props.typingUsers}/>
      }
      else {
        //console.log('menu not visible!!!')
      }

      var selectedChannel = this.props.ui.selectedChannel

      if (selectedChannel.type == 'DirectMessage' && this.props.typingUsers[selectedChannel.id]) {
        isTyping = <Text style={styles.isTypingText}>...</Text>
      }

      return (
        <View style={styles.container}>
          <View style={[styles.resizeContainer, {height: this.state.visibleHeight-24}]}>
            <View style={styles.header}>
              <TouchableOpacity onPress={() => this.props.setMenuVisibility(true)}>
                <View>
                  <Icon style={styles.menuIcon} name="bars" />
                </View>
              </TouchableOpacity>
              <Text style={styles.appNameHeading}>ChattyChatChat</Text>
              <TouchableOpacity onPress={() => this.props.onLogout(true)}>
                <View>
                  <Icon style={styles.logoutIcon} name="bomb" />
                </View>
              </TouchableOpacity>
            </View>
            <View style={styles.channelNameContainer}>
              <Text style={styles.channelName}>{this.props.ui.selectedChannel.name}</Text>
              {isTyping}
            </View>
            <Messages messages={this.props.currentMessages}/>
            <View style={styles.sendMessageContainer}>
              <TextInput
                multiline={true}
                onChange={event => this.onNewMessageTextChange(event)}
                style={[styles.messageTextBox, {height: Math.max(35, this.state.height)}]}
                value={this.state.newMessageText}/>
              <TouchableOpacity style={styles.sendButton} onPress={() => this.sendMessage()}><Icon style={styles.sendIcon} name="space-shuttle"/></TouchableOpacity>
            </View>
            {channels}
          </View>
        </View>
      );
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      
    },
    resizeContainer: {
    },
    header: {
      height: 30,
      flexDirection: 'row',
      backgroundColor: '#4d394b',
      alignItems: 'center',
    },
    appNameHeading: {
      flex: 1,
      color: '#eee',
      fontSize: 16,
      marginLeft: 12,
      fontWeight: '500',
    },
    menuIcon: {
      fontSize: 20,
      color: '#eee',
      marginLeft: 10,
    },
    logoutIcon: {
      fontSize: 20,
      color: 'red',
      marginRight: 10,
    },
    channelNameContainer: {
      height: 20,
      borderBottomWidth: 1,
      borderBottomColor: '#AAA',
      flexDirection: 'row'
    },
    channelName: {
      marginLeft: 4,
      color: '#666',
    },
    sendMessageContainer: {
      flexDirection: 'row',
      shadowColor: '#000',
      shadowRadius: 2,
      shadowOpacity: 0.8,
      shadowOffset: {
        width: 0,
        height: 0,
      },
      alignItems: 'center',
    },
    messageTextBox: {
      flex: 4,
      backgroundColor: 'white',
      fontSize: 16,
    },
    sendButton: {
      width: 30,  
    },
    sendIcon: {
      color: '#fe21c3',
      fontSize: 20,
    },
    isTypingText: {
      color: 'black',
      marginLeft: 10,
    }
  });

let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})

var mapStateToProps = function(state) {
  return {
    ui: state.ui.chatUI,
    channels: state.channels,
    // TODO: prob best to no let this get into the state in the first place
    // Actually, api should prob not return calling user
    users: state.users.filter((user) => user._id != state.session.userId),
    messages: state.messages,
    onlineUsers: state.onlineIndicators,
    unreadUsers: state.unreadIndicators,
    typingUsers: state.typingIndicators,
    session: state.session,
    currentMessages: ds.cloneWithRows(state.messages[state.ui.chatUI.selectedChannel.id] || []),
  }
}


// TODO: A lot of these are no longer being used
var mapDispatchToProps = (dispatch) => {
  return {
    onUpdateRoute: (route) => dispatch(changeRoute(route)),
    setMenuVisibility: (isVisible) => dispatch(setChannelMenuVisibility(isVisible)),
    onMount: () => {
      dispatch(loadUsers());
      dispatch(fetchAndSyncUsers());
      dispatch(startChat());
    },
    onChannelSelect: (id, name) => {
      dispatch(addChatReadStatus(id, false));
      dispatch(selectChannel(id, name));
    },
    onDirectMessageSelect: (id, name) => {
      dispatch(addChatReadStatus(id, false));
      dispatch(selectDirectMessage(id, name))
    },
    onSocketOnlineIndicators: (users) => dispatch(updateOnlineUsers(users)),
    onSocketTypingIndicators: (userTypingStatus) => dispatch(updateTypingUsers(userTypingStatus)),
    onMessageSend: (message) => dispatch(newMessage(message)),
    onMessageReceived: (message) => {
      dispatch(storeAndAddMessages([message]));
      dispatch(updatelastReadTimestamp(message.timestamp));
      dispatch(persistCurrentSession());
    },
    onChangeTypingStatus: (status) => dispatch(setTypingStatus(status)),
    onMessageConfirmation: (message) => dispatch(confirmMessage(message)),
    onMessagesReceivedConfirmation: (messages) => dispatch(confirmReceiptMessages(messages)),
    onUnseenMessage: (chatId) => dispatch(addChatReadStatus(chatId, true)),
    onLogout: () => dispatch(removeSession())
  }
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(Chat)