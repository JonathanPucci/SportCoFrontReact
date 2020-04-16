import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider } from 'react-redux'
import Store from './Store/configureStore'
import AppNavigator from './navigation/AppNavigator'
import {  Platform, KeyboardAvoidingView } from 'react-native';

const Stack = createStackNavigator();

export default class App extends React.Component {

  render() {
    return (
      <Provider store={Store}>
        <KeyboardAvoidingView
          behavior={Platform.OS == "ios" ? "padding" : "padding"}
          style={{ flex: 1 }}
          keyboardVerticalOffset={Platform.OS == "ios" ? -1000 : -500}
        >
          <AppNavigator />
        </KeyboardAvoidingView>
      </Provider>
    );
  }

  constructor() {
    super();
    this.state = {
      expoPushToken: '',
      notification: {},
    };
  }


  

}
