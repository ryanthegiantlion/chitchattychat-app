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
  removeSession
} from '../../store/actions'

import Messages from './messages'
import Channels from './channels'


// class AutoExpandingTextInput extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {text: '', height: 0};
//   }
//   render() {
//     return (
//       <TextInput
//         {...this.props}
//         multiline={true}
//         onChange={(event) => {
//           this.setState({
//             text: event.nativeEvent.text,
//             height: event.nativeEvent.contentSize.height,
//           });
//         }}
//         style={[styles.messageTextBox, {height: Math.max(35, this.state.height)}]}
//         value={this.state.text}/>
//     );
//   }
// }


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
      
      var socketUrl = 'http://localhost:5000';
      //var socketUrl = 'https://safe-atoll-11440.herokuapp.com';
      const options = {transports: ['websocket'], query: "userId=" + this.props.session.userId + "&userName=" + this.props.session.username };
      this.socket = io(socketUrl, options);

      this.socket.on('message', (data) => {
        this.props.onMessageReceived(data);
        //console.log('getting message');
        //console.log(this.props.ui.selectedChannel.type)
        //console.log(data.type)
        //console.log(data.senderId)
        // TODO: this will only work while we have one channel. could also prob clean this up.
        if (data.type == 'Channel' && this.props.ui.selectedChannel.type != 'Channel') {
            this.props.onUnseenMessage('0');
        } else if (data.type == 'DirectMessage' && this.props.ui.selectedChannel.id != data.senderId) {
          this.props.onUnseenMessage(data.senderId);
        }
        //console.log(data)
        //window.lastMessageTimeStamp = new Date(data.time);
        //if (!window.lastMessageTimeStamp.toJSON) {alert('no tojson method for date!!!')}
        //localStorage.setItem('lastMessageTimeStamp', window.lastMessageTimeStamp.toJSON());
        //onReceivedMessage(data);
        if (data.type == 'DirectMessage') {
          this.socket.emit('messageReceived', data);
        }
      });
      this.socket.on('messageConfirmation', (data) => {
        console.log('message confirmation!');
        this.props.onMessageConfirmation(data);
        // TODO: a bit hackee, we prob want to give this its own action
        // this.props.onMessage({
        //   text: data.text,
        //   type: data.type,
        //   senderName: data.senderName,
        //   senderId: data.receiverId,
        //   clientMessageIdentifier: data.clientMessageIdentifier
        // });

        //window.lastMessageTimeStamp = new Date(data.time);
        //localStorage.setItem('lastMessageTimeStamp', window.lastMessageTimeStamp.toJSON());
        //onMessageConfirmed(data);
      });
      this.socket.on('messageReceived', (data) => {
        console.log('message received confirmation!');
        this.props.onMessagesReceivedConfirmation(data);
      });
      this.socket.on('onlineIndicators', (data) => {
        //console.log('*********getting online indicators !!!!');
        this.props.onSocketOnlineIndicators(data);
        //window.onlineIndicators = {}
        //data.onlineUsers.forEach(function(userId){
        //  window.onlineIndicators[userId] = true;
        //});
        //renderUsers();
      });
      this.socket.on('typingIndicator', (data) => {
        //console.log('*********getting online indicators !!!!');
        console.log('got typing indicator');
        this.props.onSocketTypingIndicators(data);
        //window.onlineIndicators = {}
        //data.onlineUsers.forEach(function(userId){
        //  window.onlineIndicators[userId] = true;
        //});
        //renderUsers();
      });
      // socket.on('connect', function() {
      //   //console.log('connected socket. transport: ' + socket.io.engine.transport.name);
      // });
      
    }

    componentWillUnmount() {
      this.socket.disconnect();
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
      //console.log('sending message !!!');
      var selectedChannel = this.props.ui.selectedChannel;
      var messageData = {
        chatId: selectedChannel.id,
        clientStartTime: new Date(),
        type: selectedChannel.type, 
        text: this.state.newMessageText, 
        senderName: this.props.session.username, 
        receiverId: selectedChannel.id, 
        clientMessageIdentifier: this.guid()};
      //console.log('attempting to send message: ' + JSON.stringify(messageData));
      this.socket.emit('message', messageData);
      this.setState({newMessageText: '', height: 0})
      // TODO: This is incredibly hackee. We need to move to have a chat id !?!?!?!??!!?
      //console.log('******* this is the channel id ********* ');
      //console.log(selectedChannel.id)
      messageData.senderId = selectedChannel.id;
      this.props.onMessageSend(messageData);
    }

    clearTypingIndicator() {
      this.isTyping = false;
      this.socket.emit('typingIndicator', { isTyping: false, receiverId: this.props.ui.selectedChannel.id });
    }

    onNewMessageTextChange(event) {
      if (this.props.ui.selectedChannel.type == 'DirectMessage') {
        if (!this.isTyping) {
          this.socket.emit('typingIndicator', { isTyping: true, receiverId: this.props.ui.selectedChannel.id })
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
      //let channels = <Channels />
      if (this.props.ui.isMenuVisible) {
        //console.log('menu is visible!!!')
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

      //console.log('pew')
      //console.log(selectedChannel.id)
      //console.log(this.props.typingUsers)
      if (selectedChannel.type == 'DirectMessage' && this.props.typingUsers[selectedChannel.id]) {
        //console.log('here');
        isTyping = <Text style={styles.isTypingText}>...</Text>
      }
      // <TextInput 
      //   style={styles.messageTextBox} 
      //   value={this.state.newMessageText} 
      //   onChangeText={(text) => this.setState({newMessageText: text})}>

      //console.log(channels);
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
      //padding: 4,
      height: 20,
      borderBottomWidth: 1,
      borderBottomColor: '#AAA',
      flexDirection: 'row'
    },
    channelName: {
      marginLeft: 4,
      color: '#666',
      //backgroundColor: 'green',
    },
    sendMessageContainer: {
      //height: 30,
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
      //backgroundColor: 'red',
      //width: 20,
      //height: 20,
    }
  });

let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})

var mapStateToProps = function(state) {
  // console.log('1')
  // console.log(state.ui.chatUI.selectedChannel.id)
  // console.log('2')
  // console.log(state.messages)
  // console.log('3')
  // console.log(state.messages[state.ui.chatUI.selectedChannel.id])
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



var mapDispatchToProps = (dispatch) => {
  return {
    onUpdateRoute: (route) => dispatch(changeRoute(route)),
    setMenuVisibility: (isVisible) => dispatch(setChannelMenuVisibility(isVisible)),
    onMount: () => {
      dispatch(loadUsers());
      dispatch(fetchAndSyncUsers());
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
    onMessageSend: (message) => dispatch(addMessages([message])),
    onMessageReceived: (message) => {
      dispatch(storeAndAddMessages([message]));
      dispatch(updatelastReadTimestamp(message.timestamp));
      dispatch(persistCurrentSession());
    },
    onMessageConfirmation: (message) => dispatch(confirmMessage(message)),
    onMessagesReceivedConfirmation: (messages) => dispatch(confirmReceiptMessages(messages)),
    onUnseenMessage: (chatId) => dispatch(addChatReadStatus(chatId, true)),
    onLogout: () => dispatch(removeSession())
  }
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(Chat)