window.navigator.userAgent = "react-native";

import React, { Component } from 'react';
import {
  AppRegistry,
} from 'react-native';

import { Provider } from 'react-redux'
import configureStore from './store/configureStore'

import App from './app'

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

export default function Init() {

  const store = configureStore(initialState)

  class Root extends Component {

    render() {
      return (
        <Provider store={store}>
          <App />
        </Provider>
      );
    }
  }

  AppRegistry.registerComponent('ReactNativeChat', () => Root);
}