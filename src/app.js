import React, { Component } from 'react';
import {
  AsyncStorage,
  //AppRegistry,
  StyleSheet,
  Text,
  View,
  //TextInput,
  //TouchableOpacity,
  Platform
} from 'react-native';
import { connect } from 'react-redux'

import Routes from './routes'
import { loadSession, loadMessages, getOfflineMessages } from './store/actions'
//import { loadInitialState } from './store/actions'

class App extends Component {
	componentDidMount() {
    // console.log('we start loading session here !!!!!!!!!!!!!!');
		this.props.onload();

    //AsyncStorage.clear();
    // console.log('aaaaaaaaaaaaaaa');
    // AsyncStorage.getItem('messages')
    //   .then(value => console.log(value))
    //   .catch((err) => console.log('Error adding messages: ' + err));
	}

	render() {
		//console.log('aaaaaaaaaaaaaaa')
		//console.log('props')
		//console.log(this.props)
		//console.log(this.props.currentRoute)
		//console.log(Routes)
		const CurrentPage = Routes[this.props.currentRoute].Page
		// console.log(page)
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
    // messagesContainer: {
    //   flex: 1,
    // },
    // message: {
    //   padding: 4,
    // },
    // oddMessage: {
    //   backgroundColor: '#eee',
    // },
    // evenMessage: {
    //   backgroundColor: '#fff',
    // },
    // textInputContainer: {
    //   height: 30,
    //   flexDirection: 'row',
    //   padding: 4,
    //   backgroundColor: 'black',
    // },
    // textInput: {
    //   flex: 1,
    //   backgroundColor: 'white',
    //   marginRight: 4,
    // },
    // button: {
    //   backgroundColor: 'rgb(130, 224, 255)',
    //   alignItems: 'center',
    //   justifyContent: 'center',
    //   padding: 4,
    // },
    // buttonTextContainer: {

    // },
    // buttonText: {

    // }
  });