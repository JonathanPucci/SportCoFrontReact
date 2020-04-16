import * as React from 'react';
import { Platform, StatusBar, StyleSheet, View, Image, Linking, Vibration, PermissionsAndroid } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { navigationRef } from './RootNavigation';
import * as RootNavigation from './RootNavigation.js';

import BottomTabNavigator from './BottomTabNavigator';
import LoginScreen from '../screens/Login/LoginScreen';
import EventScreen from '../screens/Event/Event';
import { MultiEventScreen } from '../screens/Search/CalloutMultiEvent';
import ProfileScreen from '../screens/Profile/ProfileScreen';

import { connect } from 'react-redux';
import SpotManager from '../screens/SpotManager/SpotManager';
import SportCoApi from '../services/apiService';
import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
import * as LocationPermission from 'expo-location';
import Constants from 'expo-constants';



function LogoTitle() {
    return (
        <View >
            <Image
                style={{ width: 120, height: 30 }}
                source={require('../assets/images/BakeryFontLogo.png')}
            />
        </View>
    );
}

const Stack = createStackNavigator();

class AppNavigator extends React.Component {

    constructor() {
        super();
        this.apiService = new SportCoApi();
    }

    componentDidMount() {
        Linking.addEventListener('url', this.handleOpenURL);
    }

    componentWillUnmount() {
        Linking.removeEventListener('url', this.handleOpenURL);
    }

    handleOpenURL = (event) => {
        if (
            this.props.auth != undefined &&
            this.props.auth.user != undefined
        ) {
            var url = new URL(event.url);
            let event_id = event.url.substring(event.url.indexOf("event_id=") + 9, event.url.length)
            RootNavigation.navigate('Event', { eventData: { event: { event_id: event_id } } });
        }
    }

    componentDidUpdate(prevProps) {
        if (
            this.props.auth != undefined &&
            this.props.auth.user != undefined &&
            (prevProps == undefined || prevProps.auth == undefined || prevProps.auth.user == undefined)
        ) {
            this.registerForPushNotificationsAsync();
            this._notificationSubscription = Notifications.addListener(this._handleNotification);
            //Add permission from Android
            this.grantLocationPermissionForAndroid();
            LocationPermission.requestPermissionsAsync();

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
            // user['user_id'] = this.props.auth.user_id;
            // user['user_push_token'] = token;
            user = {
                ...user,
                user_id : this.props.auth.user_id,
                user_push_token : token
            }
            this.apiService.editEntity('users', user)
                .then((data) => { console.log('added token to user ' + user.user_id) })
                .catch((err) => { console.log('error adding token to user ' + user.user_id); console.log(err) })
        } else {
            alert('Must use physical device for Push Notifications');
        }

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
    }

    render() {
        return (
            <View style={styles.container}>
                {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
                <NavigationContainer ref={navigationRef}>
                    <Stack.Navigator>
                        {(this.props.auth == undefined || this.props.auth.user == undefined)
                            // If not logged in, the user will be shown this route
                            ? <Stack.Screen
                                name="SportCoApp"
                                component={LoginScreen}
                                options={{ headerTitle: props => <LogoTitle {...props} /> }}
                            />
                            // When logged in, the user will be shown this route
                            : <Stack.Screen name="Back" component={BottomTabNavigator} />
                        }
                        <Stack.Screen name="Event" component={EventScreen} />
                        <Stack.Screen name="Evenements" component={MultiEventScreen} />
                        <Stack.Screen name="Profile" component={ProfileScreen} />
                        <Stack.Screen name="SpotManager" component={SpotManager} />
                    </Stack.Navigator>
                </NavigationContainer>
            </View>
        );
    }

}

const mapDispatchToProps = dispatch => {
    return {
        dispatch: action => {
            dispatch(action);
        }
    };
};

function mapStateToProps(state) {
    return state;
}

export default (connectedApp = connect(mapStateToProps, mapDispatchToProps)(AppNavigator));

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
