window.navigator.userAgent = "react-native";

//import io from 'socket.io-client/socket.io';
var io = require('socket.io-client/socket.io');

console.log('creating socket');
export default socket = io('pacific-brook-70853.herokuapp.com/', {jsonp: false});
	socket.on('connect', () => {
	console.log('connected!');
});