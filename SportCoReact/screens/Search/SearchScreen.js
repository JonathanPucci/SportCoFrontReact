import * as React from 'react';
import { View, Image, Animated, Text, Button } from 'react-native';
import { connect } from 'react-redux'
import GoogleMapsAutoComplete from "../../components/GoogleMapsAutoComplete"
import Fade from "../../components/Fade"

import MapView from 'react-native-maps';

import { styles, markerStyles, CARD_WIDTH } from './styles'
import EventScrollList from './EventScrollList'
import CalloutEvent from './CalloutEvent'
import { markers } from './markers';
import SportCoApi from '../../services/apiService';

class SearchScreen extends React.Component {

  constructor() {
    super();
    this.state = {
      loading: true,
      events: [],
      currentEventIndex: 0,
      region: {
        latitude: 43.59,
        longitude: 7.1,
        latitudeDelta: 0.08,
        longitudeDelta: 0.08
      },
      moved: false,
      regionAfterMove: {}
    }

    this.index = 0;
    this.animation = new Animated.Value(0);
    this.interpolations = [];
    this.sportCoApi = new SportCoApi();
    this.retrieveEventsInArea();
  }

  getData(afterMove = false) {
    this.setState({ events: [] }, () => {
      this.retrieveEventsInArea(afterMove);
    })

  }

  retrieveEventsInArea(afterMove = false) {
    let area = {
      longitude: this.state.region.longitude,
      latitude: this.state.region.latitude
    }
    if (afterMove) {
      area.longitude = this.state.regionAfterMove.longitude;
      area.latitude = this.state.regionAfterMove.latitude;
    }
    this.sportCoApi.getEntities("events/area", area)
      .then((eventsdata) => {
        let events = eventsdata.data;
        for (let index = 0; index < events.length; index++) {
          const event = events[index];
          this.sportCoApi.getSingleEntity("events", event.event_id)
            .then(event => {
              let newArray = [...this.state.events];
              newArray[index] = event.data;
              this.setState({ events: newArray }, () => {
                this.calculateInterpolations();
                if (index == events.length - 1)
                  this.setState({ loading: false, moved: false })

              });
            })
        }
      })
  }


  calculateInterpolations() {
    const interpolations = this.state.events.map((marker, index) => {
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

  setRegionAfterMove(region) {
    this.setState({ moved: true, regionAfterMove: region })
  }

  render() {
    if (this.state.loading) {
      return (
        <View>
          <Text>Loading</Text>
        </View>);
    }
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
            onRegionChangeComplete={this.setRegionAfterMove.bind(this)}
          >
            {this.state.events.map((event, index) => {
              if (event == undefined || event.event == undefined) {
                return (<View key={index} />)
              }
              let coordinateEvent = {
                latitude: parseFloat(event.spot.spot_latitude),
                longitude: parseFloat(event.spot.spot_longitude)
              };
              return (
                <MapView.Marker
                  key={index}
                  coordinate={coordinateEvent}
                  ref={comp => this['callout-' + index] = comp}
                  onPress={() => { this.pressedEvent(index) }}
                >
                  <Animated.View style={[markerStyles.markerWrap, this.calculateOpacityStyle(index)]}>
                    <Animated.View style={[markerStyles.ring, this.calculateScaleStyle(index)]} />
                    <Image source={require('../../assets/images/pinIcon.png')}
                      style={{ height: 40, resizeMode: 'contain', bottom: 18, left: 0.5 }}
                    />
                  </Animated.View>
                  <CalloutEvent event={event} index={index} />
                </MapView.Marker>
              );
            })}

          </MapView>
          <Fade isVisible={this.state.moved} style={styles.searchButton} >
            <View>
              <Button title={"SEARCH HERE"} onPress={this.getData.bind(this, true)} />
            </View>
          </Fade>
          <EventScrollList
            handler={this.goToLocation.bind(this)}
            animation={this.animation}
            currentIndex={this.state.currentEventIndex}
            markers={this.state.events} />
        </View>
      </View>

    );
  }

  calculateOpacityStyle(index) {
    if (this.interpolations[index] != undefined)
      return {
        opacity: this.interpolations[index].opacity,
      }
  }

  calculateScaleStyle(index) {
    if (this.interpolations[index] != undefined)
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
      if (index >= this.state.events.length) {
        index = this.state.events.length - 1;
      }
      if (index <= 0) {
        index = 0;
      }
      clearTimeout(this.regionTimeout);
      this.regionTimeout = setTimeout(() => {
        if (this.index !== index) {
          this.index = index;
          const event = this.state.events[index];
          console.log(event.spot)
          let coordinateEvent = {
            latitude: parseFloat(event.spot.spot_latitude),
            longitude: parseFloat(event.spot.spot_longitude)
          };
          this.mapView.animateToRegion(coordinateEvent, 350);
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

