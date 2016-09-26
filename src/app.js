import React, { Component } from 'react';
import {
  AsyncStorage,
  StyleSheet,
  Text,
  View,
  Platform,
  Alert
} from 'react-native';
import { connect } from 'react-redux'

import Routes from './routes'
import { loadSession, loadMessages, getOfflineMessages } from './store/actions'

var PushNotification = require('react-native-push-notification');

console.log('configuring push notifications');
Alert.alert(
            'PUSH',
            'registering for push',
            [
              {text: 'OK', onPress: () => console.log('OK Pressed!')},
            ]
          );
PushNotification.configure({

    // (optional) Called when Token is generated (iOS and Android)
    onRegister: function(token) {
        console.log( 'TOKEN:', token );

        Alert.alert(
            'Alert Title',
            token,
            [
              {text: 'OK', onPress: () => console.log('OK Pressed!')},
            ]
          );
    },

    // (required) Called when a remote or local notification is opened or received
    onNotification: function(notification) {
        console.log( 'NOTIFICATION:', notification );
    },

    // ANDROID ONLY: GCM Sender ID (optional - not required for local notifications, but is need to receive remote push notifications) 
    senderID: "YOUR GCM SENDER ID",

    // IOS ONLY (optional): default: all - Permissions to register.
    permissions: {
        alert: true,
        badge: true,
        sound: true
    },

    // Should the initial notification be popped automatically
    // default: true
    popInitialNotification: true,

    /**
      * (optional) default: true
      * - Specified if permissions (ios) and token (android and ios) will requested or not,
      * - if not, you must call PushNotificationsHandler.requestPermissions() later
      */
    requestPermissions: true,
});

class App extends Component {
	componentDidMount() {
		this.props.onload();

    // AsyncStorage.clear();
	}

	render() {
		const CurrentPage = Routes[this.props.currentRoute].Page
		
	  return (
	  	<View style={styles.viewportContainer}>
	    	<CurrentPage />
	    </View>
	  );
	}
}

var mapStateToProps = (state) => state.ui;

// TODO: switch to load initial state?
var mapDispatchToProps = (dispatch) => {
	return {
		onload: () => {
      //dispatch(loadInitialState())
      dispatch(loadSession())
      //dispatch(loadMessages())
      //dispatch(getOfflineMessages())
    }
	}
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(App);



const windowMarginTop = (Platform.OS === 'ios') ? 24 : 0;

const styles = StyleSheet.create({
    viewportContainer: {
      flex: 1,
      backgroundColor: '#fff',
      marginTop: windowMarginTop,
    },
  });