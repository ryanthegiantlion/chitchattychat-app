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