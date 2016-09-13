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
  confirmMessageSent,
  confirmMessageDelivered,
  addMessages,
  updatelastReadTimestamp,
  persistCurrentSession,
  addChatReadStatus,
  removeSession
} from './actions'

import * as actions from './actions'

if (!window.navigator.userAgent) {
  window.navigator.userAgent = "react-native";
}

var io = require('socket.io-client/socket.io');

var socket;

var SocketEvents = {
  Hello: 'hello',
  Message: 'message',
  MessageSentConfirmation: 'messageSentConfirmation',
  MessageDeliveredConfirmation: 'messageDeliveredConfirmation',
  OnlineStatus: 'onlineStatus',
  TypingStatus: 'typingStatus',
}

var pingFuncId = undefined;

function chatMiddleware(store) {
  return next => action => {
    const result = next(action);

    if (action.type === actions.START_CHAT) {
      	initChat(store)
    }
	 else if (socket && action.type === actions.NEW_MESSAGE) {
      console.log(action.message)
      socket.emit(SocketEvents.Message, action.message);
    }
    else if (socket && action.type === actions.SET_TYPING_STATUS) {
      socket.emit(SocketEvents.TypingStatus, action.status)
    }
    else if (socket && action.type === actions.STOP_CHAT) {
      clearInterval(pingFuncId);
      socket.disconnect();
    }
 
    return result;
  };
}

function initChat(store) {
	var socketUrl = 'http://localhost:5000';
	let session = store.getState().session;
  //var socketUrl = 'https://safe-atoll-11440.herokuapp.com';

  var query = "userId=" + session.userId + "&userName=" + session.username;

  if (session.lastMessageTimestamp) {
    query = query + '&lastMessageTimeStamp=' + session.lastMessageTimestamp;
  }

  const options = {transports: ['websocket'], query: query };
  socket = io(socketUrl, options);

  pingFuncId = setInterval(function() {
    //console.log('pinging server');
    socket.emit(SocketEvents.Hello, {message: 'hello server'});
  }, 30000);

  socket.on(SocketEvents.Hello, function(data) {
    //console.log('got hello');
  });

  socket.on(SocketEvents.Message, (data) => {
    store.dispatch(storeAndAddMessages([data]));
  	store.dispatch(updatelastReadTimestamp(data.timestamp));
  	store.dispatch(persistCurrentSession());
   	var currentChannel = store.getState().ui.chatUI.selectedChannel;

    if (data.type == 'Group' && currentChannel.type != 'Group') {
    	store.dispatch(addChatReadStatus('0', true))
    } else if (data.type == 'DirectMessage' && currentChannel.id != data.senderId) {
      store.dispatch(addChatReadStatus(data.senderId, true))
    }
    if (data.type == 'DirectMessage') {
      socket.emit(SocketEvents.MessageDeliveredConfirmation, data);
    }
  });
  socket.on(SocketEvents.MessageSentConfirmation, (data) => {
    store.dispatch(confirmMessageSent(data))
  });
  socket.on(SocketEvents.MessageDeliveredConfirmation, (data) => {
    store.dispatch(confirmMessageDelivered(data));
  });
  socket.on(SocketEvents.OnlineStatus, (data) => {
    store.dispatch(updateOnlineUsers(data));
  });
  socket.on(SocketEvents.TypingStatus, (data) => {
    store.dispatch(updateTypingUsers(data));
  });
  // socket.on('connect', function() {
  //   //console.log('connected socket. transport: ' + socket.io.engine.transport.name);
  // });
}

module.exports = { chatMiddleware }