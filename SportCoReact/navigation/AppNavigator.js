import * as React from 'react';
import { Platform, StatusBar, StyleSheet, SafeAreaView, View, Image, Linking, Vibration, PermissionsAndroid } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { navigationRef } from './RootNavigation';
import { navigateToEvent, navigate } from './RootNavigation';

import BottomTabNavigator, { LogoTitle } from './BottomTabNavigator';
import LoginScreen from '../screens/Login/LoginScreen';
import EventScreen from '../screens/Event/Event';
import EventCreator from '../screens/Event/EventCreator';

import { MultiEventScreen } from '../screens/Search/CalloutMultiEvent';
import ProfileScreen from '../screens/Profile/ProfileScreen';

import { connect } from 'react-redux';
import SpotManager from '../screens/SpotManager/SpotManager';
import SportCoApi from '../services/apiService';
import TeamScreen from '../screens/Team/TeamScreen';
import { HeaderBackButton } from '@react-navigation/stack';
import Splash from '../Splash';
import { cardStyleInterpolatorHelper, headerStyleInterpolatorHelper } from './Helpers';


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
            let event_id = event.url.split('event_link=')[1];
            navigateToEvent(event_id)
        }
    }

    componentDidUpdate(prevProps) {
        if (
            this.props.auth != undefined &&
            this.props.auth.user != undefined &&
            (prevProps == undefined || prevProps.auth == undefined || prevProps.auth.user == undefined)
        ) {
            //Add permission from Android
            this.grantLocationPermissionForAndroid();
            this.saveDeviceTokenForNotifications();
        }
    }

    saveDeviceTokenForNotifications = async () => {
        let user = this.props.auth.user;
        user = {
            ...user,
            user_id: this.props.auth.user_id,
            user_push_token: this.props.notifications.deviceToken
        }
        // TODO : check if already set maybe? 
        let userData = await this.apiService.getSingleEntity('users', user.user_id);
        if (userData.data.user_push_token != user.user_push_token)
            this.apiService.editEntity('users', user)
                .then((data) => { console.log('added token to user ' + user.user_id) })
                .catch((err) => { console.log('error adding token to user ' + user.user_id); console.log(err) })
    }

    async grantLocationPermissionForAndroid() {
        if (Platform.OS == 'android') {
            const granted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
            if (granted) {
                console.log("You can use the ACCESS_FINE_LOCATION")
            }
            else {
                console.log("ACCESS_FINE_LOCATION permission denied")
                PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
            }
        }
    }

    render() {
        return (
            <View style={styles.container}>
                {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
                <Stack.Screen name="Splash" component={Splash}
                    options={{
                        headerShown: false,
                        tabBarVisible: false
                    }}
                />
                <SafeAreaView style={styles.container}>
                    <NavigationContainer ref={navigationRef}>
                        {(this.props.auth == undefined || this.props.auth.user == undefined)
                            // If not logged in, the user will be shown this route
                            ?
                            <Stack.Navigator >
                                <Stack.Screen
                                    name="SportCoApp"
                                    component={LoginScreen}
                                    options={{
                                        headerShown: false,
                                        headerStyleInterpolator: headerStyleInterpolatorHelper,
                                        cardStyleInterpolator: cardStyleInterpolatorHelper,
                                    }}
                                /></Stack.Navigator>
                            // When logged in, the user will be shown this route
                            :
                            <Stack.Navigator >
                                <Stack.Screen name="Back" component={BottomTabNavigator}
                                    options={{ headerTitle: props => <LogoTitle {...props} /> }}
                                />
                                <Stack.Screen name="Event" component={EventScreen}
                                    options={{
                                        headerLeft: () => (<HeaderBackButton onPress={() => { navigate('Search') }} />)

                                    }} />
                                <Stack.Screen name="EventCreator" component={EventCreator} />
                                <Stack.Screen name="Evenements" component={MultiEventScreen} />
                                <Stack.Screen name="Profile" component={ProfileScreen} />
                                <Stack.Screen name="Team" component={TeamScreen} />
                                <Stack.Screen name="SpotManager" component={SpotManager} />
                            </Stack.Navigator>
                        }
                    </NavigationContainer>
                </SafeAreaView>
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
