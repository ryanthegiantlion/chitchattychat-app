var ReactNative = require('react-native');

var { AsyncStorage, Alert } = ReactNative;

// endpoints

//var apiUrl = 'http://localhost:8080';
//var socketUrl = 'http://localhost:5000';
  
var apiUrl = 'https://desolate-savannah-81272.herokuapp.com';
var socketUrl = 'https://immense-lowlands-90076.herokuapp.com';

export const CHANGE_ROUTE = 'CHANGE_ROUTE'
export const SET_CHANNEL_MENU_VISIBLITY = 'SET_CHANNEL_MENU_VISIBLITY'
export const SELECT_CHANNEL = 'SELECT_CHANNEL'
export const SELECT_USER = 'SELECT_USER'

export const LOGIN = 'LOGIN'
export const LOGOUT = 'LOGOUT'
export const ADD_SESSION = 'ADD_SESSION'
export const LOAD_SESSION = 'LOAD_SESSION'
export const UPDATE_LAST_READ_TIMESTAMP = 'UPDATE_LAST_READ_TIMESTAMP'

export const ADD_USERS = 'ADD_USERS'
export const UPDATE_ONLINE_USERS = 'UPDATE_ONLINE_USERS'
export const ADD_CHAT_READ_STATUS = 'ADD_CHAT_READ_STATUS'
export const UPDATE_TYPING_USERS = 'UPDATE_TYPING_USERS'

export const ADD_MESSAGES = 'ADD_MESSAGES'
export const MARK_MESSAGE_AS_DELIVERED = 'MARK_MESSAGE_AS_DELIVERED'
export const MARK_MESSAGE_AS_SENT = 'MARK_MESSAGE_AS_SENT'

export const START_CHAT = 'START_CHAT'
export const STOP_CHAT = 'STOP_CHAT'
export const NEW_MESSAGE = 'NEW_MESSAGE'
export const SET_TYPING_STATUS = 'SET_TYPING_STATUS'

// initial state

// export function loadInitialState() {
// 	return function(dispatch) {
// 		var pew = dispatch(loadSession())
// 		console.log('pew')
// 		console.log(pew)
// 		//.then(despatch(loadMessages()))
// 		//.then(despatch(getOfflineMessages))
// 		//.catch((err) => console.log('error loading initial state: ' + err));
// 	}
// }


// UI

export function changeRoute(route) {
	return {
		type: CHANGE_ROUTE,
		route: route
	}
}

export function setChannelMenuVisibility(isVisible) {
	return {
		type: SET_CHANNEL_MENU_VISIBLITY,
		isMenuVisible: isVisible,
	}
}

export function selectChannel(chatId, name) {
	return {
		type: SELECT_CHANNEL,
		chatId: chatId,
		name: name
	}
}

export function selectDirectMessage(chatId, userId, name) {
	return {
		type: SELECT_USER,
		chatId: chatId,
		userId: userId,
		name: name
	}
}

// SESSION/ LOGIN

export function login(username) {
	return function (dispatch) {
		var body = JSON.stringify({
			'userName': username
		});
		fetch(apiUrl + '/users', {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json; charset=UTF-8',
			},
			body: body
		})
		.then((response) => response.json())
		.then(function(responseJson) {
				dispatch(persistSession(responseJson._id, responseJson.userName))
				.then(() => dispatch(changeRoute('chat')));
			})
		.catch((error) => { console.warn(error) });
	}
}

export function loadSession() {
	return function (dispatch) {
		AsyncStorage.getItem('session')
		.then((value) => {
			if (value) {
				let sessionObj = JSON.parse(value);
				dispatch(addSession(sessionObj.userId, sessionObj.username, sessionObj.lastMessageTimestamp))
				dispatch(changeRoute('chat'))
				dispatch(loadMessages())
			}
			else {
				dispatch(changeRoute('login'))
			}

		})
		.catch((error) => { console.log('error getting session: ' + error) });
	}
}

export function logout() {
	return {
		type: LOGOUT
	}
}

export function removeSession() {
	return function(dispatch) {
		AsyncStorage.clear()
		.then(() => dispatch(logout()))
		.catch((err) => console.log('Error trying to remove session'));
	}
}

export function persistCurrentSession() {
	return function(dispatch, getState) {
		var currentSession = getState().session
		AsyncStorage.setItem('session', JSON.stringify(currentSession))
		.then(() => console.log('saved session!'))
		.catch((error) => { console.warn('error perssisting current session : ' + error) });
	}
}

export function persistSession(userId, username) {
	return function(dispatch) {
		return AsyncStorage.setItem('session', JSON.stringify({userId: userId, username: username}))
		.then((value) => {
			dispatch(addSession(userId, username));
		})
		.catch((error) => { console.warn(error) });
	}
}

export function addSession(userId, username, lastMessageTimestamp) {
	return {
		type: ADD_SESSION,
		userId: userId,
		username: username,
		lastMessageTimestamp: lastMessageTimestamp,
		isLoggedIn: true
	}
}

export function updatelastReadTimestamp(timestamp) {
	return {
		type: UPDATE_LAST_READ_TIMESTAMP,
		timestamp: timestamp
	}
}

// USERS

export function addUsers(users) {
	return {
		type: ADD_USERS,
		users: users
	}
}

export function loadUsers() {
	return function(dispatch) {
		AsyncStorage.getItem('users')
		.then((value) => JSON.parse(value))
		.then((users) => {
			dispatch(addUsers(users))
		})
		.catch((error) => { console.log('error getting users: ' + error) });
	}
}

export function fetchAndSyncUsers(userId) {
	return function(dispatch) {
		fetch(apiUrl + '/users', {
			headers: {
				'Accept': 'Application/json',
				'Content-Type': 'Application/json; charset=UTF-8',
				'UserId': userId
			}
		})
		.then((response) => response.text())
		.then((responseBody) => {
			AsyncStorage.setItem('users', responseBody)
				.then(() => dispatch(addUsers(JSON.parse(responseBody))))
				.catch(() => console.log('Error attempting to save users'))
			return responseBody;
		})
		.catch(err => console.log('Error during fetch and sync: ' + err));
	}
}

export function updateOnlineUsers(onlineUsers) {
	return {
		type: UPDATE_ONLINE_USERS,
		indicators: onlineUsers
	}
}

export function updateTypingUsers(typingStatus) {
	return {
		type: UPDATE_TYPING_USERS,
		typingStatus: typingStatus
	}
}

export function addChatReadStatus(chatId, isUnread) {
	var status = {}
	status[chatId] = isUnread;
	return {
		type: ADD_CHAT_READ_STATUS,
		status: status
	}
}

// mesages

export function loadMessages() {
	return function(despatch) {
		AsyncStorage.getItem('messages')
		.then(value => JSON.parse(value))
		.then(messages => despatch(setInitialMessages(messages)))
		.catch(err => console.log('Error trying to load messages: ' + err));
	}
}

export function getOfflineMessages() {
	return function(dispatch, getState) {
		var userId = getState().session.userId;
		var lastMessageTimestamp = getState().session.lastMessageTimestamp;
		var url = apiUrl + '/messages/unread';
		if (lastMessageTimestamp) {
			url = url + '?lastMessageTimeStamp=' +  lastMessageTimestamp;
		}
		fetch(url, {
			headers: {
				'Accept': 'Application/json',
				'Content-Type': 'Application/json; charset=UTF-8',
				'UserId': userId
			}
		})
		.then(response => response.json())
		.then(responseJSON => {
			if (responseJSON && responseJSON.length > 0) {
				messages = responseJSON;
				var lastMessage = messages[0]
				messages.reverse()
				dispatch(storeAndAddMessages(messages));
				dispatch(updatelastReadTimestamp(lastMessage.timestamp))
				dispatch(persistCurrentSession())
			} else {
			}
		})
		.catch((err) => console.log('error fetching unread messages: ' + err));
	}
}

export function setInitialMessages(messages) {
	return {
		type: ADD_MESSAGES,
		messages: messages
	}
}

export function markMessageAsSent(message) {
	return {
		type: MARK_MESSAGE_AS_SENT,
		chatId: message.chatId,
		clientMessageIdentifier: message.clientMessageIdentifier
	}
}

export function markMessageAsDelivered(messages) {
	return {
		type: MARK_MESSAGE_AS_DELIVERED,
		messages: messages
	}
}

export function confirmMessageSent(message) {
	return function(dispatch, getState) {
		dispatch(updatelastReadTimestamp(message.timestamp));
		dispatch(persistCurrentSession());
		dispatch(markMessageAsSent(message));

		AsyncStorage.setItem('messages', JSON.stringify(getState().messages)) 
			.then((value) => console.log('Added messages to storage'))
			.catch((err) => console.log('Error adding messages to storage: ' + err));
	}
}

export function confirmMessageDelivered(messages) {
	return function(dispatch, getState) {
		dispatch(markMessageAsDelivered(messages));

		AsyncStorage.setItem('messages', JSON.stringify(getState().messages)) 
			.then((value) => console.log('Added messages to storage'))
			.catch((err) => console.log('Error adding messages to storage: ' + err));
	}
}

export function addMessages(messages) {
	let messagesById = {}
	messages.forEach((item) => {
		if (item.chatId in messagesById) {
			messagesById[item.chatId].push(item);
		} else {
			messagesById[item.chatId] = [item];
		}
	});
	return {
		type: ADD_MESSAGES,
		messages: messagesById
	}
}

export function newMessage(message) {
	return {
		type: NEW_MESSAGE,
		message: message
	}
}

export function storeAndAddMessages(messages) {
	return function(dispatch, getState) {
		dispatch(addMessages(messages))

		AsyncStorage.setItem('messages', JSON.stringify(getState().messages)) 
			.then((value) => console.log('Added messages'))
			.catch((err) => console.log('Error adding messages: ' + err));
	}
}

export function setTypingStatus(status) {
	return {
		type: SET_TYPING_STATUS,
		status: status
	}
}

export function startChat() {
	return {
		type: START_CHAT
	}
}