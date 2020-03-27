import * as React from 'react';
import { View, Image, Animated, Text, Button } from 'react-native';
import { connect } from 'react-redux'
import GoogleMapsAutoComplete from "../../components/GoogleMapsAutoComplete"
import Fade from "../../components/Fade"

import MapView from 'react-native-maps';

import { styles, markerStyles, CARD_WIDTH } from './styles'
import EventScrollList from './EventScrollList'
import CalloutEvent from './CalloutEvent'
import CustomMapView from './CustomMapView'
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
      interpolations : [],
      regionAfterMove: {},
    }

    this.index = 0;
    this.animation = new Animated.Value(0);
    this.sportCoApi = new SportCoApi();
    this.retrieveEventsInArea();
  }

  componentDidMount() {
    // We should detect when scrolling has stopped then animate
    // We should just debounce the event listener here
    this.animation.addListener(({ value }) => {
        //TODO : Find a way to go less often this listener
        // console.log("listener" + new Date())
        let index = Math.floor(value / CARD_WIDTH + 0.3); // animate 30% away from landing on the next item
        if (index >= this.state.events.length) {
            index = this.state.events.length - 1;
        }
        if (index <= 0) {
            index = 0;
        }
        clearTimeout(this.regionTimeout);
        this.regionTimeout = setTimeout(() => {
            this.index = index;
            const event = this.state.events[index];
            let coordinateEvent = {
                latitude: parseFloat(event.spot.spot_latitude),
                longitude: parseFloat(event.spot.spot_longitude),
                latitudeDelta: this.state.region.latitudeDelta,
                longitudeDelta: this.state.region.longitudeDelta
            };
            // console.log("animate To" + JSON.stringify(coordinateEvent));
            this.setState({ currentEventIndex: index });
            this.mapViewRef.mapView.animateToRegion(coordinateEvent, 350);
            clearTimeout(this.calloutTimeout);
            this.calloutTimeout = setTimeout(() => { this.showCallout(index) }, 500);
        }, 40);
    });
}


  getData(afterMove = false) {
    this.setState({ events: [] }, () => {
      this.retrieveEventsInArea(afterMove);
    })

  }

  retrieveEventsInArea(afterMove = false) {
    let area = {
      longitude: this.state.region.longitude,
      latitude: this.state.region.latitude,
      longitudeDelta: this.state.region.longitudeDelta,
      latitudeDelta: this.state.region.latitudeDelta
    }
    if (afterMove) {
      area.longitude = this.state.regionAfterMove.longitude;
      area.latitude = this.state.regionAfterMove.latitude;
      area.longitudeDelta = this.state.regionAfterMove.longitudeDelta;
      area.latitudeDelta = this.state.regionAfterMove.latitudeDelta;
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
                if (index == events.length - 1){
                  this.setState({ loading: false, moved: false })
                  this.calculateInterpolations();
                }
              });
            })
        }
      })
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
        <GoogleMapsAutoComplete handler={
          (lat, lon) => {this.mapViewRef.goToLocation(lat, lon)}} />
        <View style={styles.mapContainer}>
          <CustomMapView
            ref={(ref) => {this.mapViewRef = ref}}
            searchState={this.state}
            interpolations={this.state.interpolations}
            animation={this.animation}
            myEventScrollList={this.myEventScrollList}
          />
          <Fade isVisible={this.state.moved} style={styles.searchButton} >
            <View>
              <Button title={"SEARCH HERE"} onPress={this.getData.bind(this, true)} />
            </View>
          </Fade>
          <EventScrollList
            ref={(ref) => this.myEventScrollList = ref}
            animation={this.animation}
            currentIndex={this.state.currentEventIndex}
            markers={this.state.events}
          />
        </View>
      </View>

    );
  }

  setMapViewRef(ref){
    this.setState({mapViewRef : ref});
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

showCallout(index){
  this.mapViewRef['callout-' + index].showCallout()
}

}

const mapStateToProps = (state) => {
  return state
}

export default connect(mapStateToProps)(SearchScreen)

