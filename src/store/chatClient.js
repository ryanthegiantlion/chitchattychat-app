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
} from './actions'

import * as actions from './actions'

console.log('pew pew');

window.navigator.userAgent = "react-native";

var io = require('socket.io-client/socket.io');

var socket;

function chatMiddleware(store) {
  return next => action => {
    const result = next(action);

    if (action.type === actions.START_CHAT) {
      	initChat(store)
    }
	 else if (socket && action.type === actions.NEW_MESSAGE) {
      socket.emit('message', action.message);
    }
    else if (socket && action.type === actions.SET_TYPING_STATUS) {
      socket.emit('typingIndicator', action.status)
    }
 
    return result;
  };
}

function initChat(store) {
	var socketUrl = 'http://localhost:5000';
			let session = store.getState().session;
      //var socketUrl = 'https://safe-atoll-11440.herokuapp.com';
      const options = {transports: ['websocket'], query: "userId=" + session.userId + "&userName=" + session.username };
      socket = io(socketUrl, options);

      socket.on('message', (data) => {
        store.dispatch(storeAndAddMessages([data]));
      	store.dispatch(updatelastReadTimestamp(data.timestamp));
      	store.dispatch(persistCurrentSession());
        // TODO: this will only work while we have one channel. could also prob clean this up.
       	var currentChannel = store.getState().ui.chatUI.selectedChannel;

        if (data.type == 'Channel' && currentChannel.type != 'Channel') {
        	store.dispatch(addChatReadStatus('0', true))
        } else if (data.type == 'DirectMessage' && currentChannel.id != data.senderId) {
          store.dispatch(addChatReadStatus(data.senderId, true))
        }
        if (data.type == 'DirectMessage') {
          socket.emit('messageReceived', data);
        }
      });
      socket.on('messageConfirmation', (data) => {
        store.dispatch(confirmMessage(data))
      });
      socket.on('messageReceived', (data) => {
        store.dispatch(storeAndAddMessages([data]));
      	store.dispatch(updatelastReadTimestamp(data.timestamp));
      	store.dispatch(persistCurrentSession());
      });
      socket.on('onlineIndicators', (data) => {
        store.dispatch(updateOnlineUsers(data));
      });
      socket.on('typingIndicator', (data) => {
        store.dispatch(updateTypingUsers(data));
      });
      // socket.on('connect', function() {
      //   //console.log('connected socket. transport: ' + socket.io.engine.transport.name);
      // });
}

module.exports = { chatMiddleware }