import * as React from 'react';
import { View, Animated, Text, Button } from 'react-native';
import { connect } from 'react-redux'
import GoogleMapsAutoComplete from "../../components/GoogleMapsAutoComplete"
import Fade from "../../components/Fade"
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/Ionicons';

import { styles, CARD_WIDTH } from './styles'
import EventScrollList from './EventScrollList'
import CustomMapView from './CustomMapView'
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
      interpolations: [],
      regionAfterMove: {},
      addingEvent: true
    }

    this.index = 0;
    this.animation = new Animated.Value(0);
    this.sportCoApi = new SportCoApi();
    this.retrieveEventsInArea();
  }

  componentDidMount() {
    this.setAnimationForScrollView();
  }

  /*********************************************************************************
   *************************                 ***************************************
   ********************        DATA STUFF       ************************************
   *************************                 ***************************************
   ********************************************************************************/


  getData(afterMove = false) {
    this.setState({ events: [] }, () => {
      this.retrieveEventsInArea(afterMove);
    })

  }

  retrieveEventsInArea(afterMove = false) {
    this.sportCoApi.getEntities("events/area", afterMove ? this.state.regionAfterMove : this.state.region)
      .then((eventsdata) => {
        let events = eventsdata.data;
        for (let index = 0; index < events.length; index++) {
          const event = events[index];
          this.sportCoApi.getSingleEntity("events", event.event_id)
            .then(event => {
              let newArray = [...this.state.events];
              newArray[index] = event.data;
              this.setState({ events: newArray }, () => {
                if (index == events.length - 1) {
                  this.calculateInterpolations();
                  this.setState({ loading: false, moved: false })
                }
              });
            })
        }
      })
  }

  /*********************************************************************************
   *************************                 ***************************************
   ********************      RENDERING STUFF    ************************************
   *************************                 ***************************************
   ********************************************************************************/


  render() {
    if (this.state.loading) {
      return (
        <View>
          <Text>Loading</Text>
        </View>);
    }
    return (
      <View style={styles.container} contentContainerStyle={styles.contentContainer}>
        <GoogleMapsAutoComplete
          handler={this.goToLocation.bind(this)}
        />
        <View style={styles.mapContainer}>
          <CustomMapView
            ref={(ref) => { this.mapViewRef = ref }}
            searchState={this.state}
            interpolations={this.state.interpolations}
            animation={this.animation}
            myEventScrollList={this.myEventScrollList}
            regionMoved={this.setRegionMoved.bind(this)}
            addingEvent={this.state.addingEvent}
            addingDone={this.addingDone.bind(this)}
            navigation={this.props.navigation}
          />
          <Fade isVisible={this.state.moved} style={styles.searchButton} >
            <View>
              <Button title={"SEARCH HERE"} onPress={this.pressedSearchHere.bind(this)} />
            </View>
          </Fade>
          <Fade isVisible={this.state.moved} style={styles.searchButton} >
            {this.renderActionButton()}
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

  renderActionButton() {
    return (
      <View style={styles.actionButton}>
        {/* Rest of the app comes ABOVE the action button component !*/}
        <ActionButton buttonColor="rgba(231,76,60,1)"
          ref={(ref) => this.actionButton = ref}
          verticalOrientation="down"
          position='right'
          renderIcon={() => <Icon name="md-create" style={styles.actionButtonIcon} />}
          active={this.state.isActionButtonActive}
          onPress={() => {
            this.setState({ isActionButtonActive: true },
              () => {
                setTimeout(() => { this.actionButton.animateButton() }, 2500)
              })

          }}
        >
          <ActionButton.Item buttonColor='#9b59b6' onPress={() => { this.setState({ addingEvent: true }) }}>
            <Icon name="md-add" style={styles.actionButtonIcon} />
          </ActionButton.Item>
          <ActionButton.Item buttonColor='#3498db' onPress={() => { }}>
            <Icon name="md-notifications-off" style={styles.actionButtonIcon} />
          </ActionButton.Item>
          <ActionButton.Item buttonColor='#1abc9c' onPress={() => { }}>
            <Icon name="md-done-all" style={styles.actionButtonIcon} />
          </ActionButton.Item>
        </ActionButton>
      </View >
    );

  }

  /*********************************************************************************
   *************************                 ***************************************
   ********************      REGION MOVE STUFF    **********************************
   *************************                 ***************************************
   ********************************************************************************/

  setRegionMoved(region) {
    this.setState({ moved: true, regionAfterMove: region });
  }

  pressedSearchHere() {
    this.getData(true);
  }

  goToLocation(lat, lon) {
    //Only coming from autoComplete
    this.setState(
      {
        region: {
          ...this.state.region,
          latitude: lat,
          longitude: lon,
        },
        regionAfterMove: {
          ...this.state.region,
          latitude: lat,
          longitude: lon,
        }
      }
      , () => {
        // console.log("animate To" + JSON.stringify(this.state.region));
        this.mapViewRef.mapView.animateToRegion(this.state.region, 1500);
        // console.log("GoGetData" + JSON.stringify(this.state.regionAfterMove));

        this.getData(true);
      });
  }

  showCallout(index) {
    this.mapViewRef['callout-' + index].showCallout()
  }

  /*********************************************************************************
   *************************                 ***************************************
   ********************      ANIMATION STUFF    ************************************
   *************************                 ***************************************
   ********************************************************************************/

  setAnimationForScrollView() {
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
    this.setState({interpolations : interpolations});
  }

  /*********************************************************************************
   *************************                 ***************************************
   ********************      CREATION  STUFF    ************************************
   *************************                 ***************************************
   ********************************************************************************/


  addingDone() {
    this.setState({ addingEvent: false })
  }

}

const mapStateToProps = (state) => {
  return state
}

export default connect(mapStateToProps)(SearchScreen)

