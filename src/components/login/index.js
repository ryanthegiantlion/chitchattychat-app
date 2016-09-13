'use strict';
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
} from 'react-native';

import { connect } from 'react-redux'

import { login, changeRoute } from '../../store/actions'

export default class Login extends Component {

  constructor(props) {
    super(props);
    this.state = {username: ''};
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.box}>
          <TextInput
            autoFocus = {true}
            returnKeyType = "go"
            style={styles.username}
            placeholder = "John Smith"
            onChangeText={(text) => this.setState({username: text})}
            val={this.state.username}/>
          <TouchableOpacity style={styles.button} onPress={() => this.props.onLogin(this.state.username)}>
            <View>
              <Text style={styles.buttonText}>Login</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    box: {
      borderRadius: 4,
      shadowOpacity: 0.8,
      shadowRadius: 2,
      shadowColor: '#000',
      shadowOffset: {height: 0, width: 0},
      padding: 20,
    },
    username: {
      fontSize: 20,
      height: 30,
      width: 200,
      backgroundColor: '#f2f2f2',
    },
    button: {
      height: 30,
      width: 200,
      backgroundColor: '#4caf50',
      marginTop: 10,
      padding: 4,
    },
    buttonText: {
      color: 'white',
      textAlign: 'center',
      fontWeight: 'bold',
      fontSize: 16,
    },
  });

var mapStateToProps = (state) => state.session;

const mapDispatchToProps = (dispatch) => {
  return {
    onUpdateRoute: (route) => dispatch(changeRoute(route)),
    onLogin: (username) => dispatch(login(username))
  }
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(Login);