import * as React from 'react';
import { Platform, StatusBar, StyleSheet, View, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import BottomTabNavigator from './BottomTabNavigator';
import LoginScreen from '../screens/Login/LoginScreen';
import EventScreen from '../screens/Event/Event';
import {MultiEventScreen} from '../screens/Search/CalloutMultiEvent';

import { connect } from 'react-redux';

function LogoTitle() {
    return (
      <View >
         <Image
        style={{width:120,height: 30 }}
        source={require('../assets/images/BakeryFontLogo.png')}
      />
       </View>
    );
  }

const Stack = createStackNavigator();

class AppNavigator extends React.Component {


    render() {
        return (
            <View style={styles.container}>
                {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
                <NavigationContainer >
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
