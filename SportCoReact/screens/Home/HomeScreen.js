import * as React from 'react';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View, Button } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { connect } from 'react-redux'
import { styles } from './styles'
import * as Facebook from 'expo-facebook';

class HomeScreen extends React.Component {

  render() {
    // console.log("from Home :");
    return (
      <View style={styles.container}>
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          <View style={styles.welcomeContainer}>
            <Text style={styles.text}>HomePage</Text>
          </View>

          <View style={styles.welcomeContainer}>
            <Text style={styles.text}>Test Redux with favorite Sports : </Text>
            

          </View>
        </ScrollView>
      </View>
    );
  }

}

/*
{this.props.favoriteSports.map(sport => {
              return (
                <View key={sport.id}>
                  <Text style={styles.text}>{sport.desc}</Text>
                </View>
              )
            })}
*/


const mapStateToProps = (state) => {
  return state
}


const mapDispatchToProps = (dispatch) => {
  return {
    dispatch: (action) => { dispatch(action) }
  }
}

export default connect(mapStateToProps)(HomeScreen)

