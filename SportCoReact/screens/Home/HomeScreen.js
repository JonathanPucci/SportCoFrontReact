import * as React from 'react';
import { Image, Text, View } from 'react-native';
import { Button, Icon } from 'react-native-elements';
import { ScrollView } from 'react-native-gesture-handler';
import { connect } from 'react-redux'
import { styles } from './styles'

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
    this.api.getEntities("spots/coordinates",
      {
        latitude: 43.591317,
        longitude: 7.124781,
        longitudeDelta: 0.01,
        latitudeDelta: 0.01
      })
      .then(data => {
        console.log(data)
      })
  }

  navigateToSearch() {
    this.props.navigation.navigate('Search');
  }

  navigateToSpotManager(){
    this.props.navigation.navigate('SpotManager');
  }

  componentDidMount() {
    // this.getData();
    this.navigateToSpotManager();
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>

          <View style={styles.imageContainer}>
            <Image source={require('../../assets/images/logomultisports.png')} style={styles.image} />
          </View>

          <View style={styles.welcomeContainer}>
            <Text style={styles.text}>Welcome to SportCoNow </Text>
            <Text style={[styles.text, { textDecorationLine: 'underline' }]}>Amazing sport sessions ahead !</Text>
            <Text style={styles.text}>{`\nFrom this tab, you can help the community \nby adding your favorite spots \nto the database via this button`} </Text>
          </View>

          <View style={styles.buttonView}>
            <Button
              title={`  Add Spot`}
              color='white'
              icon={
                <Icon
                  name="map-marker-plus"
                  type='material-community'
                  size={20}
                  color="white"
                />
              }
              onPress={this.navigateToSpotManager.bind(this)}
            />
          </View>

          <View style={styles.welcomeContainer}>
            <Text style={styles.text}>{`\nThrough this one \nyou can start searching sessions `} </Text>
          </View>

          <View style={styles.buttonView}>
            <Button
              title={"Search"}
              color='white'
              icon={
                <Icon
                  name="search"
                  size={20}
                  color="white"
                />
              }
              onPress={this.navigateToSearch.bind(this)} />
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

