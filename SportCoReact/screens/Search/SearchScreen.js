import * as React from 'react';
import { Image, Platform, Text, TouchableOpacity, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { connect } from 'react-redux'

import MapView from 'react-native-maps';

import { styles } from './styles'

class SearchScreen extends React.Component {

  state = {}

  getInitialState() {
    return {
      region: {
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.001,
        longitudeDelta: 0.001
      },
    };
  }

  onRegionChange(region) {
    this.setState({ region });
  }

  goToInitialLocation() {
    let region = Object.assign({}, this.state.region);
    region["latitudeDelta"] = 0.005;
    region["longitudeDelta"] = 0.005;
    this.mapView.animateToRegion(region, 2000);
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          <View style={styles.mapContainer}>
            <MapView style={styles.mapStyle}
              region={this.state.region}
              zoomEnabled={true}
              followUserLocation={true}
              showsUserLocation={true}
              ref={ref => (this.mapView = ref)}
              onMapReady={this.goToInitialLocation.bind(this)}
            />
          </View>
        </ScrollView>
      </View>
    );
  }
  componentDidMount() {
    navigator.geolocation.getCurrentPosition(pos => {
      this.setState(prevState => {
        return {
          region: {
            ...prevState.region,
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude
          }

        };
      });
    },
      err => {
        console.log(err);
        alert("Fetching the Position failed");
      })
  }
}


const mapStateToProps = (state) => {
  return state
}

export default connect(mapStateToProps)(SearchScreen)

