import * as React from 'react';
import { Image, Platform, Text, TouchableOpacity, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { connect } from 'react-redux'
import {styles} from './styles'

class SearchScreen extends React.Component {

  render() {
    return (
      <View style={styles.container}>
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          <View style={styles.welcomeContainer}>
            <Text style={styles.text}>SearchPage</Text>
          </View>

         
        </ScrollView>
      </View>
    );
  }
}


const mapStateToProps = (state) => {
  return {
    favoriteSports: state.favoriteSports
  }
}

export default connect(mapStateToProps)(SearchScreen)

