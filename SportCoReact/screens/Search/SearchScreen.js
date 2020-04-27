import * as React from 'react';
import { View, Animated, Text, Platform, TouchableOpacity } from 'react-native';
import { Overlay, Button, Icon } from 'react-native-elements'
import { connect } from 'react-redux'
import { GoogleMapsAutoComplete } from "../../components/GoogleMapsAutoComplete"
import Fade from "../../components/Fade"
import IonIcon from 'react-native-vector-icons/Ionicons';
import MCIIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useFocusEffect } from '@react-navigation/native';
import { styles } from './styles'
import EventScrollList from './EventScrollList'
import CustomMapView from './CustomMapView'
import SportCoApi from '../../services/apiService';
import { CARD_HEIGHT, CARD_WIDTH } from '../../components/CardEvent'
import SportsAvailable from '../../components/SportsAvailable';
import { FloatingAction } from "react-native-floating-action";
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import Geolocation from 'react-native-geolocation-service';



//Effect to get Events at focus (after coming back from events)
// function FocusEffectComp({ navigation, handler }) {
//   useFocusEffect(
//     React.useCallback(() => {
//       if (!SearchScreen.firstTime)
//         handler();
//       SearchScreen.firstTime = false;
//       return () => { };
//     }, [])
//   );
//   return null;
// }

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
      isChoosingAFilter: false,
      firstSearch: true,
      sportsAccepted: ['basket', 'soccer', 'futsal', 'workout', 'running', 'volley', 'beachvolley', 'tennis']
    }
    this.animation = new Animated.Value(0);
    this.sportCoApi = new SportCoApi();
  }

  // static firstTime = true;

  initMap = () => {
    this.watchId = Geolocation.getCurrentPosition(
      this.retrieveEventsNearMe,
      this.retrieveEventsInInitialArea,
      {
        enableHighAccuracy: true,
        timeout: 4000,
        maximumAge: 4000
      }
    );
  }


  retrieveEventsNearMe = (position) => {
    // console.log(Platform.OS + " got it, going to search");
    // Geolocation.clearWatch(this.watchId);
    this.setState(
      { ...this.state, region: { ...this.state.region, latitude: position.coords.latitude, longitude: position.coords.longitude } },
      () => {
        this.getData(true)
      });
  }

  retrieveEventsInInitialArea = (err) => {
    // console.log(Platform.OS + " error going initial hardcoded")
    console.log("=============")
    console.log(err)
    console.log("=============")
    this.setState(
      { ...this.state, region: { ...this.state.region, latitude: 43.6, longitude: 7.1 } },
      this.getData);
  }

  goToCurrentLocation() {
    Geolocation.getCurrentPosition(
      position => {
        let region = {
          latitude: parseFloat(position.coords.latitude),
          longitude: parseFloat(position.coords.longitude),
          latitudeDelta: initialZoom.latitudeDelta,
          longitudeDelta: initialZoom.longitudeDelta
        };
        let initialRegion = region;
        if (this.mapViewRef != undefined)
          this.mapViewRef.mapView.animateToRegion(initialRegion, 500);
      },
      error => console.log(error),
      {
        enableHighAccuracy: true,
        timeout: 4000,
        maximumAge: 2000
      }
    );
  }

  componentDidMount() {
    this.initMap();
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
    // console.log(Platform.OS + " retrieve In Area");
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
      this.setState({
        eventsRetrieved: eventsFetchedSoFar,
        events: eventsFetchedSoFar,
        firstSearch: false,
        loading: false,
        moved: false,
        optionsVisible: false
      },
        () => {
          this.filterBySport();
        })
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
        {/* <FocusEffectComp navigation={this.props.navigation} handler={this.getData} /> */}
        {this.renderMain()}
      </View>
    )
  }
  renderMain() {
    if (this.state.loading) {
      return (
        <View style={{marginTop : 200,alignSelf : "center", justifyContent:'center', alignItems:'center'}}>
          <Text style={{alignSelf : "center", justifyContent:'center', alignItems:'center', textAlign:'center'}}>Loading</Text>
          <Button onPress={this.initMap} title='Reload Position' style={{alignSelf : "center", justifyContent:'center', alignItems:'center'}} />
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
            style={styles.mapContainer}
            ref={(ref) => { this.mapViewRef = ref }}
            region={this.state.region}
            currentLatitudeDelta={this.state.region.latitudeDelta}
            currentLongitudeDelta={this.state.region.longitudeDelta}
            events={this.state.events}
            interpolations={this.state.interpolations}
            animation={this.animation}
            myEventScrollList={(index) => { this.setState({ currentEventIndex: index, reloadCallout: true }) }}
            regionMoved={this.setRegionMoved.bind(this)}
            navigation={this.props.navigation}
            pressedMap={this.pressedMap.bind(this)}

          />
        </View>
        <Fade isVisible={this.state.optionsVisible} style={styles.searchButton} >
          <View >
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
        {this.renderActionButton()}

        <View style={[
          { position: 'absolute', bottom: 10, elevation: 2, flex: 1, },
          Platform.OS == 'ios' ? { left: -50 } : { right: -50 }
        ]}>
          <EventScrollList
            ref={(ref) => this.myEventScrollList = ref}
            animation={this.animation}
            currentIndex={this.state.currentEventIndex}
            markers={this.state.events}
            pressedCard={(index) => { this.showEventCardAndMarker(index) }}
            scrollEnded={() => { this.scrollEnded() }}
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
              buttonStyle={{ marginTop: 50 }}
              title={'Filter'}
              onPress={() => { this.filterBySport() }}
            />
          </View>
        </Overlay>
      </View >
    );
  }

  renderActionButton() {
    let actions = [
      {
        text: "",
        icon: (<IonIcon name="md-add" style={styles.actionButtonIcon} />),
        name: "ADD",
        position: 1
      },
      {
        text: "",
        icon: (<MCIIcon name="filter" style={styles.actionButtonIcon} />),
        name: "FILTER",
        position: 2
      },
      {
        text: "",
        icon: (<MCIIcon name="arch" style={styles.actionButtonIcon} />),
        name: "CENTER",
        position: 3
      }

    ];

    return (

      <FloatingAction
        position={Platform.OS == 'ios'?'left' : 'right'}
        color="#2089dc"
        visible={this.state.optionsVisible}
        showBackground={false}
        distanceToEdge={{ vertical: CARD_HEIGHT + 30, horizontal: 20 }}
        actions={actions}
        buttonSize={60}
        floatingIcon={(<IonIcon name="md-create" style={styles.actionButtonIcon} />)}
        onPressItem={this.hitActionButton.bind(this)}
      />
    )
  }

  hitActionButton(name) {
    switch (name) {
      case 'FILTER':
        this.setState({ isChoosingAFilter: true })
        break;
      case 'ADD':
        this.props.navigation.navigate('Event', {
          eventData: { event: { event_id: '' } }
        });
        break;
      case 'CENTER':
        this.goToCurrentLocation()
        break;
      default:
        break;
    }
  }

  /*********************************************************************************
   *************************                 ***************************************
   ********************      REGION MOVE STUFF    **********************************
   *************************                 ***************************************
   ********************************************************************************/

  setRegionMoved(region) {
    if (this.regionMovedTimeout != undefined)
      clearTimeout(this.regionMovedTimeout);

    this.regionMovedTimeout = setTimeout(() => {
      this.setState({ moved: true, region: region, optionsVisible: true },
        () => {
          this.optionsVisibleTimeout = setTimeout(() => {
            this.setState({ optionsVisible: false })
          }, 2500)
        }
      );
    }, 100);
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
    let masterIndex = CustomMapView.getIndexOfClusterMaster(index, this.state.events);
    if (this.mapViewRef['callout' + masterIndex] != null)
      this.mapViewRef['callout' + masterIndex].showCallout();
    setTimeout(() => {
      if (this.mapViewRef['callout' + masterIndex] != null)
        this.mapViewRef['callout' + masterIndex].hideCallout()
    }, 4000);
  }

  /*********************************************************************************
   *************************                 ***************************************
   ********************      ANIMATION STUFF    ************************************
   *************************                 ***************************************
   ********************************************************************************/

  showEventCardAndMarker = (index) => {
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
  }

  scrollEnded = () => {
    let index = this.myEventScrollList.myScroll.currentIndex;
    this.showEventCardAndMarker(index);
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

