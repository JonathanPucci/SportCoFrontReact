import * as React from 'react';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { connect } from 'react-redux'

export class HomeScreen extends React.Component {

  render() {
    console.log("from Home :");
    console.log(this.props);
    return (
      <View style={styles.container}>
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          <View style={styles.welcomeContainer}>
            <Text style={styles.text}>HomePage</Text>
          </View>

          <View style={styles.welcomeContainer}>
            <Text style={styles.text}>Test Redux with favorite Sports : </Text>

            {this.props.favoriteSports.map(sport => {
              return (
                <View key={sport.id}>
                  <Text style={styles.text}>{sport.desc}</Text>
                </View>
              )
            })}
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

export default connect(mapStateToProps)(HomeScreen)


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  contentContainer: {
    paddingTop: 30,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },

  text: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  }
});
