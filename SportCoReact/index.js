import { AppRegistry, Platform } from 'react-native';
import App from './App';
// import { typography } from './typography';

// typography()

AppRegistry.registerComponent('Timaka', () => App);

if (Platform.OS === 'web') {
  const rootTag = document.getElementById('root') || document.getElementById('main');
  AppRegistry.runApplication('Timaka', { rootTag });
}
