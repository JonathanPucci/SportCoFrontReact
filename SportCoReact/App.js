import * as React from 'react';
import { Provider } from 'react-redux'
import Store from './Store/configureStore'
import AppNavigator from './navigation/AppNavigator'
import { Platform, KeyboardAvoidingView } from 'react-native';
import {APP_URL} from './constants/AppConstants'

export default class App extends React.Component {

  render() {
    return (
      <Provider store={Store}>
        <KeyboardAvoidingView
          behavior={Platform.OS == "ios" ? "padding" : "padding"}
          style={{ flex: 1 }}
          keyboardVerticalOffset={Platform.OS == "ios" ? -1000 : -500}
        >
          <AppNavigator uriPrefix={APP_URL} />
        </KeyboardAvoidingView>
      </Provider>
    )
  }

  constructor() {
    super();
    this.state = {
      expoPushToken: '',
      notification: {},
    };
  }




}
