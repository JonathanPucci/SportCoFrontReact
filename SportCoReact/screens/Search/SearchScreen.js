import * as React from 'react';
import { View, Text } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { connect } from 'react-redux'
import { SearchBar } from 'react-native-elements';
import GoogleMapsAutoComplete from "../../components/GoogleMapsAutoComplete"

import MapView from 'react-native-maps';

import { styles } from './styles'
import LocationIqService from '../../services/locationIqService';

class SearchScreen extends React.Component {

  state = {
    locationIqService: new LocationIqService(),
    search: '',
  }

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

  updateSearch = search => {
    this.setState({ search });
  }

  render() {
    return (
      <View style={styles.container} contentContainerStyle={styles.contentContainer}>
        <GoogleMapsAutoComplete handler={this.changeRegionState.bind(this)} />
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
      </View>
    );
  }
  componentDidMount() {
    navigator.geolocation.getCurrentPosition(pos => {
      this.changeRegionState(pos.coords.latitude, pos.coords.longitude)
    },
      err => {
        console.log(err);
        alert("Fetching the Position failed");
      })
  }


  goToInitialLocation() {
    let region = Object.assign({}, this.state.region);
    this.mapView.animateToRegion(region, 2000);
  }

  changeRegionState(lat, lon) {
    this.setState(prevState => {
      return {
        region: {
          ...prevState.region,
          latitude: lat,
          longitude: lon,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        }

      };
    });
  }
}




const mapStateToProps = (state) => {
  return state
}

export default connect(mapStateToProps)(SearchScreen)

