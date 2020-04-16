import * as React from 'react';
import { Platform, StatusBar, StyleSheet, View, Image, Linking } from 'react-native';
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

    componentDidMount() {
        console.log('hello');
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
