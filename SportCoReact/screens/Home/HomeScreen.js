import * as React from 'react';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View, Button } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { connect } from 'react-redux'
import { styles, eventCalloutStyles } from './styles'

import Icon from '../../components/Icon'
class HomeScreen extends React.Component {

  render() {
    return (
      <View style={styles.container}>
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          <View style={styles.welcomeContainer}>
            <Text style={styles.text}>HomePage</Text>
          </View>
          <View style={styles.imageContainer}>
            <Image source={require('../../assets/images/logomultisports.png')} style={styles.image} />
          </View>

          <View style={styles.welcomeContainer}>
            <Text style={styles.text}>Test Redux with user info : </Text>

            {this.props.auth != undefined && this.props.auth.user != undefined && (
              <View >
                <Text style={styles.text}>{this.props.auth.user.displayName}</Text>
              </View>
            )
            }
          </View>

          
        </ScrollView>
      </View>
    );
  }

}

const mapStateToProps = (state) => {
  return state
}

export default connect(mapStateToProps)(HomeScreen)

