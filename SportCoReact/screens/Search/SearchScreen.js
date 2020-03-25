import * as React from 'react';
import { View, Image, Animated } from 'react-native';
import { connect } from 'react-redux'
import GoogleMapsAutoComplete from "../../components/GoogleMapsAutoComplete"

import MapView from 'react-native-maps';

import { styles, markerStyles, CARD_WIDTH } from './styles'
import { markers } from './markers';
import EventScrollList from './EventScrollList'
import CalloutEvent from './CalloutEvent'

class SearchScreen extends React.Component {

  constructor() {
    super();
    this.index = 0;
    this.animation = new Animated.Value(0);
    const interpolations = this.state.markers.map((marker, index) => {
      const inputRange = [
        (index - 1) * CARD_WIDTH,
        index * CARD_WIDTH,
        ((index + 1) * CARD_WIDTH),
      ];
      const scale = this.animation.interpolate({
        inputRange,
        outputRange: [1, 2.5, 1],
        extrapolate: "clamp",
      });
      const opacity = this.animation.interpolate({
        inputRange,
        outputRange: [0.35, 1, 0.35],
        extrapolate: "clamp",
      });
      return { scale, opacity };
    });
    this.interpolations = interpolations;
  }

  state = {
    search: '',
    markers: markers,
    currentEventIndex: 0,
    region: {
      latitude: 43.59,
      longitude: 7.1,
      latitudeDelta: 0.08,
      longitudeDelta: 0.08
    }
  }

  render() {
    return (
      <View style={styles.container} contentContainerStyle={styles.contentContainer}>
        <GoogleMapsAutoComplete handler={this.goToLocation.bind(this)} />
        <View style={styles.mapContainer}>
          <MapView style={styles.mapStyle}
            initialRegion={this.state.region}
            zoomEnabled={true}
            followUserLocation={true}
            showsUserLocation={true}
            ref={ref => (this.mapView = ref)}
          >
            {this.state.markers.map((marker, index) => {
              return (
                <MapView.Marker
                  key={index}
                  coordinate={marker.coordinate}
                  ref={comp => this['callout-' + index] = comp}
                  onPress={() => { this.pressedEvent(index) }}
                >
                  <Animated.View style={[markerStyles.markerWrap, this.calculateOpacityStyle(index)]}>
                    <Animated.View style={[markerStyles.ring, this.calculateScaleStyle(index)]} />
                    <Image source={require('../../assets/images/pinIcon.png')}
                      style={{ height: 40, resizeMode: 'contain', bottom: 18, left: 0.5 }}
                    />
                  </Animated.View>
                  <CalloutEvent event={marker} index={index} />
                </MapView.Marker>
              );
            })}

          </MapView>
          <EventScrollList
            handler={this.goToLocation.bind(this)}
            animation={this.animation}
            currentIndex={this.state.currentEventIndex}
            markers={this.state.markers} />
        </View>
      </View>
    );
  }

  calculateOpacityStyle(index) {
    return {
      opacity: this.interpolations[index].opacity,
    }
  }

  calculateScaleStyle(index) {
    return {
      transform: [
        {
          scale: this.interpolations[index].scale,
        },
      ],
    }
  }

  pressedEvent(index) {
    this.setState({ currentEventIndex: index })
  }

  componentDidMount() {
    // We should detect when scrolling has stopped then animate
    // We should just debounce the event listener here
    this.animation.addListener(({ value }) => {
      let index = Math.floor(value / CARD_WIDTH + 0.3); // animate 30% away from landing on the next item
      if (index >= this.state.markers.length) {
        index = this.state.markers.length - 1;
      }
      if (index <= 0) {
        index = 0;
      }
      clearTimeout(this.regionTimeout);
      this.regionTimeout = setTimeout(() => {
        if (this.index !== index) {
          this.index = index;
          const { coordinate } = this.state.markers[index];
          this.mapView.animateToRegion(coordinate, 350);
          this.setState({ currentEventIndex: index });
          this['callout-' + index].showCallout();
        }
      }, 40);
    });
  }

  goToLocation(lat, lon) {
    this.setState(prevState => {
      return {
        region: {
          ...prevState.region,
          latitude: lat,
          longitude: lon,
          latitudeDelta: 0.08,
          longitudeDelta: 0.08
        }
      };
    }, () => {
      this.mapView.animateToRegion(this.state.region, 1500);
    });

  }

}




const mapStateToProps = (state) => {
  return state
}

export default connect(mapStateToProps)(SearchScreen)

