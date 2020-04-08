import * as React from 'react';
import { View, Animated, Text } from 'react-native';
import { Overlay, Button, Icon } from 'react-native-elements'
import { connect } from 'react-redux'
import GoogleMapsAutoComplete from "../../components/GoogleMapsAutoComplete"
import Fade from "../../components/Fade"
import ActionButton from 'react-native-action-button';
import IonIcon from 'react-native-vector-icons/Ionicons';
import MCIIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useFocusEffect } from '@react-navigation/native';
import { styles } from './styles'
import EventScrollList from './EventScrollList'
import CustomMapView from './CustomMapView'
import SportCoApi from '../../services/apiService';
import { CARD_HEIGHT, CARD_WIDTH } from '../../components/CardEvent'
import SportsAvailable from '../../components/SportsAvailable';


//Effect to get Events at focus (after coming back from events)
function FocusEffectComp({ navigation, handler }) {
  useFocusEffect(
    React.useCallback(() => {
      if (!SearchScreen.firstTime)
        handler();
      SearchScreen.firstTime = false;
      return () => { };
    }, [])
  );
  return null;
}

export const initialZoom = {
  latitudeDelta: 0.08,
  longitudeDelta: 0.08
};


class SearchScreen extends React.Component {

  constructor() {
    super();
    this.state = {
      loading: true,
      events: [],
      eventsRetrieved: [],
      eventsFetchedSoFar: [],
      currentEventIndex: 0,
      region: {
        latitude: '',
        longitude: '',
        latitudeDelta: initialZoom.latitudeDelta,
        longitudeDelta: initialZoom.longitudeDelta
      },
      moved: false,
      optionsVisible: false,
      interpolations: [],
      addingEvent: true,
      isChoosingAFilter: false,
      firstSearch: true,
      sportsAccepted: ['basket', 'soccer', 'futsal', 'workout', 'running', 'volley', 'beachvolley', 'tennis']
    }
    this.animation = new Animated.Value(0);
    this.sportCoApi = new SportCoApi();
    this.watchId = navigator.geolocation.watchPosition(
      this.retrieveEventsNearMe.bind(this),
      this.retrieveEventsInInitialArea.bind(this),
      { timeout: 1000 }
    );
  }

  static firstTime = true;


  retrieveEventsNearMe(position) {
    navigator.geolocation.clearWatch(this.watchId);

    this.setState(
      { ...this.state, region: { ...this.state.region, latitude: position.coords.latitude, longitude: position.coords.longitude } },
      () => {
        this.getData(true)
      });
  }

  retrieveEventsInInitialArea() {
    this.setState(
      { ...this.state, region: { ...this.state.region, latitude: 43.6, longitude: 7.1 } },
      this.getData.bind(this, true));
  }


  componentDidMount() {
    this.setAnimationForScrollView();
  }

  /*********************************************************************************
   *************************                 ***************************************
   ********************        DATA STUFF       ************************************
   *************************                 ***************************************
   ********************************************************************************/


  getData(fromFocus = false) {
    this.setState({ events: [], eventsRetrieved: [], eventsFetchedSoFar: [], currentEventIndex: 0, loading: true }, () => {
      this.retrieveEventsInArea();
    })
  }

  retrieveEventsInArea() {
    this.sportCoApi.getEntities("events/area", this.state.region)
      .then((eventsdata) => {
        let events = eventsdata.data;
        if (events.length == 0) {
          this.setState({ firstSearch: false, loading: false, moved: false, optionsVisible: false })
        }
        if (events.length == 0)
          return

        this.setState({ numberOfEventsToRetrieve: events.length }, () => {
          for (let index = 0; index < events.length; index++) {
            const event = events[index];
            this.sportCoApi.getSingleEntity("events", event.event_id)
              .then(event => {
                let newArray = [...this.state.eventsFetchedSoFar];
                newArray[index] = event.data;
                this.calculateInterpolations();
                this.setState({ eventsFetchedSoFar: newArray })
                this.checkAllDataFetchedBeforeSetState();
              })
          }
        })
      })
  }

  checkAllDataFetchedBeforeSetState() {
    //already done loading --> stop
    if (!this.state.loading)
      return
    let eventsFetchedSoFar = this.state.eventsFetchedSoFar;
    //not even retrieved all events --> stop
    if (eventsFetchedSoFar.length != this.state.numberOfEventsToRetrieve)
      return
    let complete = true;

    for (let index = 0; index < eventsFetchedSoFar.length; index++) {
      const element = eventsFetchedSoFar[index];
      if (element == undefined) {
        complete = false;
      }
    }
    if (complete) {
      this.setState({ eventsRetrieved: eventsFetchedSoFar, firstSearch: false, loading: false, moved: false, optionsVisible: false }, () => { this.filterBySport() })
    }
  }

  /*********************************************************************************
   *************************                 ***************************************
   ********************      RENDERING STUFF    ************************************
   *************************                 ***************************************
   ********************************************************************************/

  render() {
    return (
      <View style={styles.container} contentContainerStyle={styles.contentContainer}>
        <FocusEffectComp navigation={this.props.navigation} handler={this.getData.bind(this, true)} />
        {this.renderMain()}
      </View>
    )
  }
  renderMain() {
    if (this.state.loading) {
      return (
        <View>
          <Text>Loading</Text>
        </View>
      );
    }
    return (
      <View style={styles.container} contentContainerStyle={styles.contentContainer}>
        <GoogleMapsAutoComplete
          handler={this.goToLocation.bind(this)}
        />

        <View style={styles.mapContainer}>
          <CustomMapView
            ref={(ref) => { this.mapViewRef = ref }}
            region={this.state.region}
            events={this.state.events}
            interpolations={this.state.interpolations}
            animation={this.animation}
            myEventScrollList={(index) => { this.setState({ currentEventIndex: index, reloadCallout: true }) }}
            regionMoved={this.setRegionMoved.bind(this)}
            addingEvent={this.state.addingEvent}
            addingDone={this.addingDone.bind(this)}
            navigation={this.props.navigation}
            pressedMap={this.pressedMap.bind(this)}
          />
          <Fade isVisible={this.state.optionsVisible} style={styles.actionButton} >
            {this.renderActionButton()}
          </Fade>
          <Fade isVisible={this.state.optionsVisible} style={styles.searchButton} >
            <View>
              <Button
                title={"  Search Here  "}
                color='white'
                icon={
                  <Icon
                    name="search"
                    size={20}
                    color="white"
                  />
                }
                onPress={this.pressedSearchHere.bind(this)} />
            </View>
          </Fade>

          <EventScrollList
            ref={(ref) => this.myEventScrollList = ref}
            animation={this.animation}
            currentIndex={this.state.currentEventIndex}
            markers={this.state.events}
          />
        </View>
        <Overlay
          isVisible={this.state.isChoosingAFilter}
          onBackdropPress={() => { this.setState({ isChoosingAFilter: false }) }}
        >
          <View style={styles.sports}>
            <SportsAvailable
              sportsSelected={this.state.sportsAccepted}
              sportsSelectedChanged={(newsports) => { this.setState({ sportsAccepted: newsports }) }}
            />
            <Button
              titleStyle={{ fontSize: 20 }}
              buttonStyle={{ marginTop: 100 }}
              title={'Filter'}
              onPress={() => { this.filterBySport() }}
            />
          </View>
        </Overlay>
      </View>
    );
  }

  renderActionButton() {
    return (
      <ActionButton
        buttonColor="#2089dc"
        ref={(ref) => this.actionButton = ref}
        verticalOrientation="up"
        position='center'
        renderIcon={() => <IonIcon name="md-create" style={styles.actionButtonIcon} />}
        active={this.state.isActionButtonActive}
        onPress={() => {
          this.setState({ isActionButtonActive: true },
            () => {
              setTimeout(() => { this.actionButton.reset() }, 2500)
            })
        }}
      >
        <ActionButton.Item
          buttonColor='#43bcff'
          offsetX={0}
          onPress={() => {
            this.props.navigation.navigate('Event', {
              event: {}
            });
          }}>
          <IonIcon name="md-add" style={styles.actionButtonIcon} />
        </ActionButton.Item>
        <ActionButton.Item
          offsetX={0}
          buttonColor='#43bcff'
          onPress={() => { this.setState({ isChoosingAFilter: true }) }}>
          <MCIIcon name="filter" style={styles.actionButtonIcon} />
        </ActionButton.Item>

      </ActionButton>
    );

  }

  /*********************************************************************************
   *************************                 ***************************************
   ********************      REGION MOVE STUFF    **********************************
   *************************                 ***************************************
   ********************************************************************************/

  setRegionMoved(region) {
    this.setState({ moved: true, region: region, optionsVisible: true },
      () => {
        setTimeout(() => {
          this.setState({ optionsVisible: false })
        }, 2500)
      }
    );
  }

  pressedSearchHere() {
    this.getData(true);
  }

  pressedMap() {
    this.setState({ optionsVisible: true });
    setTimeout(() => { this.setState({ optionsVisible: true }) }, 2500);
  }

  goToLocation(lat, lon) {
    //Only coming from autoComplete
    this.setState(
      {
        region: {
          latitudeDelta: initialZoom.latitudeDelta,
          longitudeDelta: initialZoom.longitudeDelta,
          latitude: lat,
          longitude: lon,

        }
      }
      , () => {
        this.mapViewRef.mapView.animateToRegion(this.state.region, 1500);

        this.getData(true);
      });
  }

  showCallout(index) {
    this.mapViewRef['callout' + index].showCallout();
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
      let index = Math.floor(value / CARD_WIDTH + 0.3); // animate 30% away from landing on the next item
      if (index >= this.state.events.length) {
        index = this.state.events.length - 1;
      }
      if (index <= 0) {
        index = 0;
      }
      clearTimeout(this.regionTimeout);
      this.regionTimeout = setTimeout(() => {
        const event = this.state.events[index];
        let coordinateEvent = {
          latitude: parseFloat(event.spot.spot_latitude),
          longitude: parseFloat(event.spot.spot_longitude),
          latitudeDelta: this.state.region.latitudeDelta,
          longitudeDelta: this.state.region.longitudeDelta,
        };

        this.setState({ currentEventIndex: index });
        this.mapViewRef.mapView.animateToRegion(coordinateEvent, 350);
        this.showCallout(index);
      }, 300);
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
    this.setState({ interpolations: interpolations });
  }

  /*********************************************************************************
   *************************                 ***************************************
   ********************      CREATION  STUFF    ************************************
   *************************                 ***************************************
   ********************************************************************************/


  addingDone() {
    this.setState({ addingEvent: false })
  }

  filterBySport() {
    let newEvents = [];
    for (let index = 0; index < this.state.eventsRetrieved.length; index++) {
      const event = this.state.eventsRetrieved[index];
      if (this.state.sportsAccepted.includes(event.event.sport))
        newEvents.push(event);
    }
    this.setState({ events: [], isChoosingAFilter: false }, () => { this.setState({ events: newEvents }) });
  }

}

const mapStateToProps = (state) => {
  return state
}

export default connect(mapStateToProps)(SearchScreen)

