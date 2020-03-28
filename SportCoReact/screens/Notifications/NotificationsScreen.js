import * as React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import { RectButton, ScrollView } from 'react-native-gesture-handler';
import { connect } from 'react-redux'
import {styles} from './styles'
import SportCoApi from '../../services/apiService';

class NotificationsScreen extends React.Component {
  
  constructor(){
    super()
    this.state = {
      event : {}
    }
    this.apiService = new SportCoApi()

  }

  componentDidMount(){
    this.apiService.getAllEntities('events')
    .then((data)=>{
      this.setState({event : data.data[0]})
    })
  }

  render() {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <Text style={styles.text}>Clean Page redux ready</Text>
      </ScrollView>
    );
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

export default connect(mapStateToProps, mapDispatchToProps)(NotificationsScreen)

