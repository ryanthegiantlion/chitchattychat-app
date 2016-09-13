'use strict';
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

export default class Loading extends Component {

    render() {
      return (
        <View style={styles.container}>
          <Text style={styles.title}>Loading...</Text>
        </View>
      );
    }
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
  },
});