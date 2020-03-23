import { createStackNavigator } from 'react-navigation-stack';
import LoginScreen from '../screens/Login/LoginScreen';

export const LoginNavigator = createStackNavigator({
  Login: {
    screen: LoginScreen,
    navigationOptions: {
      title: 'Login'
    }
  }
});
