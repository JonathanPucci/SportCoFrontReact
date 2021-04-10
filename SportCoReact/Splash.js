import * as React from 'react';
import { View } from 'react-native';
import LottieView from 'lottie-react-native';
import { navigate } from './navigation/RootNavigation';
import { Layout } from './constants/Layout';
import Colors from './constants/Colors';

export default class Splash extends React.Component {

  render() {
    return (
      <View style={{flex : 1, height : Layout.window.height+300, width : Layout.window.width, backgroundColor : Colors.timakaColor }} >
        <LottieView source={require('./assets/splash_sports.json')}
          autoPlay
          loop={false}
          speed={1.5}
          onAnimationFinish={() => { console.log('finished animation lottie');navigate('SportCoApp') }}
        >
        </LottieView>
      </View>
    )
  }

  constructor() {
    super();

  }

}