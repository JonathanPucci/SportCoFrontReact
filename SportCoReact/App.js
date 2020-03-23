import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider } from 'react-redux'
import Store from './Store/configureStore'
import AppNavigator from './navigation/AppNavigator'
const Stack = createStackNavigator();

export default class App extends React.Component {

  render() {
    return (
      <Provider store={Store}>
        <AppNavigator />
      </Provider>
    );
  }

}
