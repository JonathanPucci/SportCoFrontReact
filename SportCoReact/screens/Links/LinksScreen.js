import * as React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import { RectButton, ScrollView } from 'react-native-gesture-handler';
import { connect } from 'react-redux'
import {styles} from './styles'

export class LinksScreen extends React.Component {
  state = {
    sports: [
      {
        id: 1,
        desc: "Football"
      },
      {
        id: 2,
        desc: "Basketball"
      },
    ]
  }
  render() {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <Text style={styles.text}>Clean Page</Text>
        {this._displaySports()}
      </ScrollView>
    );
  }


_toggleFavorite(sport) {
  const action = { type: "TOGGLE_FAVORITE", value: sport }
  this.props.dispatch(action);
}  

  _displaySports() {
    return (
      <ScrollView style={styles.container}>
        {this.state.sports.map(sport => {
          return (

            <View key={sport.id}>
              <Button title={sport.desc} onPress={() => this._toggleFavorite(sport)}>{sport.desc}</Button>
            </View>
          )
        })}
      </ScrollView>
    )

  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch: (action) => { dispatch(action) }
  }
}

const mapStateToProps = (state) => {
  return state
}

export default connect(mapStateToProps, mapDispatchToProps)(LinksScreen)

