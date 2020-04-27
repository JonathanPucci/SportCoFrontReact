import * as React from 'react';
import { Provider } from 'react-redux'
import Store from './Store/configureStore'
import PushNotificationManager from './services/PushNotificationManager'

import AppNavigator from './navigation/AppNavigator'
import { Platform, KeyboardAvoidingView } from 'react-native';
import { APP_URL } from './constants/AppConstants'
import { InAppNotificationProvider } from 'react-native-in-app-notification';
import DefaultNotificationBody from './NotificationBodyComponent';

export default class App extends React.Component {

  render() {
    return (
      <InAppNotificationProvider notificationBodyComponent={DefaultNotificationBody} iconApp={require('./assets/images/TimakaLogo.png')}>
        <Provider store={Store}>
          <KeyboardAvoidingView
            behavior={Platform.OS == "ios" ? "padding" : "padding"}
            style={{ flex: 1 }}
            keyboardVerticalOffset={Platform.OS == "ios" ? -1000 : -500}
          >
            <PushNotificationManager>
              <AppNavigator uriPrefix={APP_URL} />
            </PushNotificationManager>
          </KeyboardAvoidingView>
        </Provider>
      </InAppNotificationProvider>
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