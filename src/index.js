/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

// import React, { Component } from 'react';
import React, { Component } from 'react';
import {
  AppRegistry,
  //StyleSheet,
  //Text,
  //View,
  //TextInput,
  //TouchableOpacity,
  //Platform
} from 'react-native';

import { Provider } from 'react-redux'
import configureStore from './store/configureStore'

import App from './app'
//import Routes from './routes'

window.navigator.userAgent = "react-native";

//import io from 'socket.io-client/socket.io';
// var io = require('socket.io-client/socket.io');

const initialState = {
  ui: {currentRoute: 'loading', chatUI: {
    isMenuVisible: false, 
    selectedChannel: {
      type: 'Channel',
      id: 0,
      name: 'General'
    }
  }},
  session: {},
  channels: [{_id: 0, name: "General"}],
  users: [],
  onlineIndicators: {},
  unreadIndicators: {},
  typingIndicators: {},
  messages: {},
}
const store = configureStore(initialState)

export default function Init() {

  // immediately check to see if use is logged on


  //const windowMarginTop = (Platform.OS === 'ios') ? 24 : 0;

  // class App extends Component {
  //   render() {
  //     return (
  //       <View style={styles.viewportContainer}><Text>Hello world</Text></View>
  //     );
  //   }
  // }

  class Root extends Component {

    render() {
      return (
        <Provider store={store}>
          <App />
        </Provider>
      );
    }
  }

  // class MessageItem extends Component {
  //   render() {
  //     var oddEvenStyle = styles.oddMessage;
  //     if (this.props.index % 2 == 0)
  //     {
  //       oddEvenStyle = styles.evenMessage;
  //     }
  //     return (
  //       <Text style={[styles.message, oddEvenStyle]}>{this.props.msg}</Text>
  //     )
  //   }
  // }

//   class ReactNativeChat extends Component {

//   constructor(props) {
//     super(props);
//     const options = {transports: ['websocket']};
//     this.socket = io('https://pacific-brook-70853.herokuapp.com/', options);

//     this.socket.on('chat message', (msg) => this.onMessageReceived(msg));

//     this.socket.on('connect', function() {
//       console.log('connected socket. transport: ' + this.socket.io.engine.transport.name);
//     }.bind(this));
//     this.state = {
//       newMessage: '',
//       messages: ['dummy message1', 'dummy message 2']
//     }
//   }

//   onMessageReceived(msg) {
//     console.log('receieved message. message: ' + msg);
//     var newMessages = [
//           ...this.state.messages, msg
//         ];
//     this.setState({messages: newMessages})
//   }

//   onSubmit() {
//     this.socket.emit('chat message', this.state.newMessage);
//     this.setState({newMessage: ''})
//   }

//   render() {
//     var messages = this.state.messages.map((msg, index) => 
//       <MessageItem key={index} msg={msg} index={index} />)
//     return (
//       <View style={styles.container}>
//         <View style={styles.messagesContainer}>
//           {messages}
//         </View>
//         <View style={styles.textInputContainer}>
//           <TextInput 
//             onChangeText={(newMessage) => this.setState({newMessage})}
//             value={this.state.newMessage}
//             style={styles.textInput}/>
//           <TouchableOpacity style={styles.button} onPress={() => this.onSubmit()}>
//             <View style={styles.buttonTextContainer}>
//               <Text style={styles.buttonText}>Send</Text>
//             </View>
//           </TouchableOpacity>
//         </View>
//       </View>
//     );
//   }
// }

  AppRegistry.registerComponent('ReactNativeChat', () => Root);
}