import * as React from 'react';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View, Button } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { connect } from 'react-redux'
import { styles, eventCalloutStyles } from './styles'

import Icon from '../../components/Icon'
import Fade from '../../components/Fade'
import SportCoApi from '../../services/apiService';

class HomeScreen extends React.Component {


  constructor() {
    super();
    this.state = {
      isVisible: false
    }
    this.api = new SportCoApi();
    // this.api.getEntities("events/area", {longitude : 42, latitude  : 43})
    // .then(data => {
    //   console.log(data)
    // })

  }

  getData() {
    this.api.getEntities("events/area", { longitude: 42, latitude: 43 })
      .then(data => {
        console.log(data)
      })
  }

  navigate() {
    // console.log(this.props.navigation);
    this.props.navigation.navigate('Event', {
      event: {}
    });
  }

  componentDidMount(){
    this.navigate();
  }

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

          <Button title={"TestData"} onPress={this.getData.bind(this)} />
          <Button title={"TestNavigate"} onPress={this.navigate.bind(this)} />
          <Button title={"Fade"} onPress={() => { this.setState({ isVisible: !this.state.isVisible }) }} />

          <Fade isVisible={this.state.isVisible}>
            <View style={{
              position: "absolute",
              top: 70,
              left: 150,
              paddingVertical: 10,
              backgroundColor: '#DDD',
              borderRadius: 10
            }}>
              <Button title={"SEARCH HERE"} onPress={() => { }} />
            </View>
          </Fade>
        </ScrollView>
      </View>
    );
  }

}

const mapStateToProps = (state) => {
  return state
}

export default connect(mapStateToProps)(HomeScreen)

