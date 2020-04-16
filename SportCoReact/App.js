import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider } from 'react-redux'
import Store from './Store/configureStore'
import AppNavigator from './navigation/AppNavigator'
import { Vibration, Platform, PermissionsAndroid, KeyboardAvoidingView, Linking } from 'react-native';
import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
import * as LocationPermission from 'expo-location';
import Constants from 'expo-constants';
import SportCoApi from './services/apiService';

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
    this.apiService = new SportCoApi();
  }


  componentDidMount(prevProps) {
    if (
      this.props.auth != undefined &&
      this.props.auth.user != undefined &&
      (prevProps == undefined || prevProps.auth == undefined || prevProps.auth.user == undefined)
    ) {
      this.registerForPushNotificationsAsync();

      // Handle notifications that are received or selected while the app
      // is open. If the app was closed and then opened by tapping the
      // notification (rather than just tapping the app icon to open it),
      // this function will fire on the next tick after the app starts
      // with the notification data.
      this._notificationSubscription = Notifications.addListener(this._handleNotification);

      //Add permission from Android
      this.grantLocationPermissionForAndroid();

    }
  }


  registerForPushNotificationsAsync = async () => {
    if (Constants.isDevice) {
      const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
      let finalStatus = existingStatus;

      if (finalStatus !== 'granted') {
        const { status2 } = await Permissions.askAsync(Permissions.USER_FACING_NOTIFICATIONS);
        const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
        finalStatus = status2 ? status2 : status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }

      token = await Notifications.getExpoPushTokenAsync();
      console.log(Platform.OS + " token " + token);
      this.setState({ expoPushToken: token });
      let user = this.props.auth.user;
      user.user_id = this.props.auth.user_id;
      user.user_push_token = token;

      this.apiService.editEntity('users', user)
        .then((data) => { console.log(data) })
        .catch((err) => { console.log(err) })
    } else {
      alert('Must use physical device for Push Notifications');
    }
    console.log('Hey1');

    if (Platform.OS === 'android') {
      Notifications.createChannelAndroidAsync('default', {
        name: 'default',
        sound: true,
        priority: 'max',
        vibrate: [0, 250, 250, 250],
      });
    }
  };


  _handleNotification = notification => {
    Vibration.vibrate();
    // console.log(notification);
    this.setState({ notification: notification });
  };

  async grantLocationPermissionForAndroid() {
    if (Platform.OS == 'android') {
      const granted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
      if (granted) {
        console.log("You can use the ACCESS_FINE_LOCATION")
      }
      else {
        console.log("ACCESS_FINE_LOCATION permission denied")
      }
    }
    LocationPermission.requestPermissionsAsync();

  }

}
