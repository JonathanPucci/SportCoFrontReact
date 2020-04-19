import * as React from 'react';
import { View, Image, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/Home/HomeScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import NotificationsScreen from '../screens/Notifications/NotificationsScreen';
import SearchScreen from '../screens/Search/SearchScreen';
import EventCalendar from '../screens/EventCalendar/EventCalendar';
import { Icon } from 'react-native-elements';

import Colors from '../constants/Colors';

const BottomTab = createBottomTabNavigator();
const INITIAL_ROUTE_NAME = 'Search';

export default function BottomTabNavigator({ navigation, route }) {
  // Set the header title on the parent stack navigator depending on the
  // currently active tab. Learn more in the documentation:
  // https://reactnavigation.org/docs/en/screen-options-resolution.html
  navigation.setOptions({ headerTitle: props => <LogoTitle {...props} /> });

  return (
    <BottomTab.Navigator
      initialRouteName={INITIAL_ROUTE_NAME}
      tabBarOptions={{ style: { height: Platform.OS == 'android' ? 60 : 80 } }}
    >
      <BottomTab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: '',
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-home" />,
        }}
      />
      <BottomTab.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{
          title: '',
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="ios-information-circle-outline" />,
        }}
      />
      <BottomTab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          title: '',
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-search" />,
        }}
      />
      <BottomTab.Screen
        name="Calendar"
        component={EventCalendar}
        options={{
          title: '',
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="ios-calendar" />,
        }}
      />
      <BottomTab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: '',
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="ios-body" />,
        }}
      />
    </BottomTab.Navigator>
  );
}

function TabBarIcon(props) {
  return (
    <View
      style={{ top:  10 }}
    >
      <Icon
        name={props.name}
        type='ionicon'
        size={30}
        color={props.focused ? Colors.tabIconSelected : Colors.tabIconDefault}
      />
    </View>
  )

}



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
