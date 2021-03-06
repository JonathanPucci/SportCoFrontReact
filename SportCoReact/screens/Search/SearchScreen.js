import * as React from 'react';
import { View, Animated, Text, Platform, ScrollView, Image } from 'react-native';
import { Button, Icon } from 'react-native-elements'
import { connect } from 'react-redux'
import { GoogleMapsAutoComplete } from "../../components/GoogleMapsAutoComplete"
import { useFocusEffect } from '@react-navigation/native';
import { styles } from './styles'
import EventScrollList from './EventScrollList'
import CustomMapView from './CustomMapView'
import SportCoApi from '../../services/apiService';
import Geolocation from 'react-native-geolocation-service';
import { SPORTS, SPORTS_FILTERS } from '../../constants/DbConstants';
import { logDebugInfo, logDebugError } from '../Event/Helpers';
import { Keyboard } from 'react-native';
import { translate } from '../../App';
import FilterOverlay from './FilterOverlay';
import CalendarView from './CalendarView/CalendarView';
import { Layout, BOTTOM_TAB_HEIGHT, TOP_NAV_BAR_HEIGHT, AUTOCOMPLETE_HEIGHT } from '../../constants/Layout';

import { getStatusBarHeight } from 'react-native-status-bar-height';
import { mapSportIcon } from '../../helpers/mapper';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';

const FILTERS_HEIGHT = 175;


// Effect to get Events at focus (after coming back from events)
function FetchData({ onFocus }) {
  useFocusEffect(
    React.useCallback(() => {
      if (SearchScreen.firstTime) {
        SearchScreen.firstTime = false;
      }
      else
        onFocus();
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

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      fetchingData: true,
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
      hostIdFilter: '',
      hostNameFilter: '',
      sportsAccepted: SPORTS,
      viewCalendar: false,
      sortSport: false,
      sortDate: true
    }
    this.animation = new Animated.Value(0);
    this.sportCoApi = new SportCoApi();
  }

  static firstTime = true;

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
    this.setState(
      { ...this.state, loading: true, region: { ...this.state.region, latitude: position.coords.latitude, longitude: position.coords.longitude } },
      () => {
        this.getData()
      });
  }

  retrieveEventsInInitialArea = (err) => {
    logDebugError('ERROR RETRIEVING ERROR', err)
    this.setState(
      { ...this.state, region: { ...this.state.region, latitude: 43.6, longitude: 7.1 } },
      this.getData);
  }

  goToCurrentLocation() {
    Geolocation.getCurrentPosition(
      position => {
        let region = {
          latitude: parseFloat(position.coords.latitude) - 0.015,
          longitude: parseFloat(position.coords.longitude),
          latitudeDelta: initialZoom.latitudeDelta,
          longitudeDelta: initialZoom.longitudeDelta
        };
        if (this.mapViewRef != undefined)
          this.mapViewRef.mapView.animateToRegion(region, 500);
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


  getData() {
    this.setState({ events: [], eventsRetrieved: [], eventsFetchedSoFar: [], currentEventIndex: 0, fetchingData: true }, () => {
      this.retrieveEventsInArea();
    })
  }

  retrieveEventsInArea = () => {
    // console.log(Platform.OS + " retrieve In Area");
    console.log(this.state.region)
    this.sportCoApi.getEntities("events/area", this.state.region)
      .then((eventsdata) => {

        if (eventsdata == null)
          logDebugInfo('THERE IT WAS NULL', eventsdata)
        if (eventsdata == null)
          return
        let events = eventsdata.data;
        if (events.length == 0) {
          logDebugInfo('NO EVENT FOUND', '');
          this.setState({ loading: false, moved: false, optionsVisible: false })
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
                this.setState({ eventsFetchedSoFar: newArray }, () => {
                  this.checkAllDataFetchedBeforeSetState();
                })
              })
          }
        })
      })
  }

  checkAllDataFetchedBeforeSetState = async () => {
    //already done loading --> stop
    if (!this.state.fetchingData)
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
      eventsFetchedSoFar = eventsFetchedSoFar.filter((item) => {
        return (
          item.event.visibility == 'public' || // It is public
          item.event.host_id == this.props.auth.user_id ||  // I'm the host
          item.participants.some(e => { return e.user_id == this.props.auth.user_id }) // I'm a participant
        )
      });
      let allUsers = [];
      try {
        allUsersData = await this.sportCoApi.getAllEntities('users');
        allUsers = allUsersData.data;
      }
      catch (error) {
        logDebugInfo('ERROR RETRIEVING ALL USERS FOR SEARCH FILTER', error);
      }
      this.setState({
        eventsRetrieved: eventsFetchedSoFar,
        events: eventsFetchedSoFar,
        loading: false,
        fetchingData: false,
        moved: false,
        optionsVisible: false,
        currentEventIndex: Platform.OS == 'android' ? eventsFetchedSoFar.length - 1 : 0,
        allUsers: allUsers,
      },
        () => {
          this.filterBySport(true);
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
        <FetchData onFocus={this.getData.bind(this)} />
        <View>
          {this.renderMain()}
        </View>
      </View>
    )
  }

  renderMain() {
    if (this.state.loading) {
      return (
        <View style={{ marginTop: 200, alignSelf: "center", justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ alignSelf: "center", justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>{translate("Loading")}</Text>
          <Button onPress={this.initMap} title='Reload Position' style={{ alignSelf: "center", justifyContent: 'center', alignItems: 'center' }} />
        </View>
      );
    }

    return (
      <SafeAreaView style={styles.container} contentContainerStyle={styles.contentContainer}>

        {!this.state.viewCalendar ? (
          <View>
            <GoogleMapsAutoComplete
              handler={this.goToLocation.bind(this)}
              stylesContainer={{ width: "80%", marginTop: 5 }}
              stylesInput={{ height: AUTOCOMPLETE_HEIGHT }}
            />
            <View style={styles.mapContainer}>
              <View style={[
                { position: 'absolute', bottom: BOTTOM_TAB_HEIGHT, elevation: 2, zIndex: 2, flex: 1, },
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
            {/*********************
               ***  ACTION BUTTONS ***
               *********************/}
            <View style={{ position: 'absolute', top: TOP_NAV_BAR_HEIGHT - AUTOCOMPLETE_HEIGHT + 5, right: 0, height: Layout.window.height - BOTTOM_TAB_HEIGHT }}>
              <View style={[styles.actionButton, { top: 0 }]}>
                <Icon name='settings' color='#2089dc' type='octicon' size={25} onPress={() => { this.hitActionButton('FILTER') }} />
                {this.state.sportsAccepted.length != SPORTS.length && (
                  <View style={{ position: 'absolute', backgroundColor: '#2089dc', justifyContent: 'center', width: 15, height: 15, borderRadius: 7, bottom: 35, left: 35 }}>
                    <Text style={{ color: 'white', fontSize: 10, textAlign: 'center' }}>{this.state.sportsAccepted.length}</Text>
                  </View>
                )}
                {this.state.hostNameFilter != '' && (
                  <View style={{ position: 'absolute', backgroundColor: '#2089dc', justifyContent: 'center', width: 15, height: 15, borderRadius: 7, top: 35, left: 35 }}>
                    <Text style={{ color: 'white', fontSize: 10, textAlign: 'center' }}>{this.state.hostNameFilter.split(' ')[0][0]}</Text>
                  </View>
                )}
              </View>
              <View style={[styles.actionButton, { top: 55 }]}>
                <Icon name='cursor' color='#2089dc' type='simple-line-icon' size={25} onPress={() => { this.hitActionButton('CENTER') }} />
              </View>
              <View style={[styles.actionButton, { top: 110 }]}>
                <Icon name='search' color='#2089dc' type='material' size={30} onPress={this.pressedSearchHere.bind(this)} />
              </View>
              <View style={[styles.actionButton, { top: 165 }]}>
                <Icon name='calendar' color='#2089dc' type='font-awesome' size={30} onPress={() => { this.hitActionButton('CALENDAR') }} />
              </View>
              <View style={[{ position: 'absolute', bottom: BOTTOM_TAB_HEIGHT + 100 }, Platform.OS == 'ios' ? { right: 15 } : { left: 15 }]}>
                <Icon name='add' raised color='#2089dc' size={25} onPress={() => { this.hitActionButton('ADD') }} />
              </View>
            </View>
          </View>
        ) : (
          <View style={{ flex: 1 }}>
            {/*********************
             ***  CALENDAR VIEW ***
             *********************/}

            <View style={{ height: FILTERS_HEIGHT, width: Layout.window.width }}>

              <View style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'center', marginTop: 20 }} >
                <Button
                  containerStyle={{ width: 150 }}
                  titleStyle={{ fontSize: 14 }}
                  icon={<Icon containerStyle={{ marginRight: 20 }} name='soccer-ball-o' color={this.state.sortSport ? 'white' : '#2089dc'} type='font-awesome' size={15} onPress={() => { this.hitActionButton('SORT_SPORT') }} />}
                  title={translate("Sort By Sport")}
                  type={this.state.sortSport ? 'solid' : 'outline'}
                  onPress={() => { this.hitActionButton('SORT_SPORT') }}
                />
                <Button
                  containerStyle={{ width: 150, marginLeft: 20 }}
                  titleStyle={{ fontSize: 13 }}
                  icon={<Icon containerStyle={{ marginRight: 20 }} name='calendar' color={this.state.sortDate ? 'white' : '#2089dc'} type='foundation' size={15} onPress={() => { this.hitActionButton('SORT_DATE') }} />}
                  title={translate("Sort By Date")}
                  type={this.state.sortDate ? 'solid' : 'outline'}
                  onPress={() => { this.hitActionButton('SORT_DATE') }}
                />
              </View>
              <ScrollView horizontal style={{ alignSelf: 'center', }} showsHorizontalScrollIndicator={false}>
                {SPORTS_FILTERS.map((sport, i, a) => {
                  let sportSelected = this.state.sportsAccepted.length != SPORTS.length && this.state.sportsAccepted.includes(sport);
                  return (
                    <TouchableOpacity key={sport} style={[
                      { flex: 1, marginLeft: 20, marginRight: 20, flexDirection: 'column', justifyContent: 'center' },

                    ]}
                      onPress={() => { this.hitActionButton('FILTER_SPORT', sport) }}>
                      {/* <Icon name={mapSportIcon(sport).iconName} type={mapSportIcon(sport).iconFamily} size={20} /> */}
                      <Image source={mapSportIcon(sport).sportFilterImage} resizeMode='contain' style={{ height: 50, width: 50, }} />
                      <Text style={{ textAlign: 'center', fontFamily: sportSelected ? 'ClanPro-Bold' : 'ClanPro-Regular' }}>{sport.charAt(0) + sport.substring(1).toLowerCase()}</Text>
                      {
                        sportSelected && (
                          <View style={{ height: 20, width: 20, borderRadius: 10, backgroundColor: 'green', alignSelf: 'center' }} />
                        )
                      }
                    </TouchableOpacity>
                  )
                })
                }
              </ScrollView>
              <View style={{ backgroundColor: 'rgb(230,230,230)', height: 8, width: Layout.window.width }} />
            </View>

            <View style={{ height: Layout.window.height - BOTTOM_TAB_HEIGHT - FILTERS_HEIGHT - 90}}>
              <CalendarView
                navigation={this.props.navigation}
                events={this.state.events}
                navigation={this.props.navigation}
                sortDate={this.state.sortDate}
                sortSport={this.state.sortSport}
                searchFilter={this.state.sortSport}
              />
            </View>
            <View style={{ alignSelf: 'flex-end', right: 25, position: 'absolute', top: Layout.window.height - BOTTOM_TAB_HEIGHT - 200 }} >
              <Icon raised name='map' color='#2089dc' type='font-awesome' size={25} onPress={() => { this.hitActionButton('MAP') }} />
            </View>
          </View>
        )
        }




        <FilterOverlay
          sportsAccepted={this.state.sportsAccepted}
          hostNameFilter={this.state.hostNameFilter}
          isChoosingAFilter={this.state.isChoosingAFilter}
          hostIdFilter={this.state.hostIdFilter}
          allUsers={this.state.allUsers}
          eventsRetrieved={this.state.eventsRetrieved}
          pressedSearchHere={this.pressedSearchHere}
          filterBySport={this.filterBySport.bind(this)}
          setState={(state, callback) => { this.setState(state, callback) }}
        />
      </SafeAreaView >
    );
  }


  hitActionButton(name, sport) {
    switch (name) {
      case 'FILTER':
        this.setState({ isChoosingAFilter: true })
        break;
      case 'FILTER_SPORT':
        this.addSportFilter(sport);
        break;
      case 'ADD':
        this.props.navigation.navigate('EventCreator', {
          eventData: { event: { event_id: '' } }
        });
        break;
      case 'CENTER':
        this.goToCurrentLocation()
        break;
      case 'CALENDAR':
        this.setState({ viewCalendar: true })
        break;
      case 'SORT_DATE':
        this.setState({ sortDate: true, sortSport: false })
        break;
      case 'SORT_SPORT':
        this.setState({ sortSport: true, sortDate: false })
        break;
      case 'MAP':
        this.setState({ viewCalendar: false })
      default:
        break;
    }
  }

  addSportFilter = (sport) => {
    var otherSport = 'NOPE';
    if (sport == 'volley')
      otherSport = 'beachvolley';
    if (sport == 'soccer')
      otherSport = 'futsal';
    if (this.state.sportsAccepted.length == SPORTS.length) {
      let newSports = otherSport != 'NOPE' ? [sport, otherSport] : [sport];
      this.setState({ sportsAccepted: newSports }, () => this.filterBySport(true))
    } else {
      let newSports = [...this.state.sportsAccepted];
      if (this.state.sportsAccepted.includes(sport)) {
        newSports.splice(newSports.indexOf(sport), 1);
        if (otherSport != 'NOPE')
          newSports.splice(newSports.indexOf(otherSport), 1);

      } else {
        newSports.push(sport);
        if (otherSport != 'NOPE')
          newSports.push(otherSport);
      }
      if (newSports.length == 0) {
        newSports = SPORTS
      }
      this.setState({ sportsAccepted: newSports }, () => this.filterBySport(true))
    }
  }



  /*********************************************************************************
   *************************                 ***************************************
   ********************      REGION MOVE STUFF    **********************************
   *************************                 ***************************************
   ********************************************************************************/

  setRegionMoved(region) {
    // if (this.regionMovedTimeout != undefined)
    //   clearTimeout(this.regionMovedTimeout);

    // this.regionMovedTimeout = setTimeout(() => {
    this.setState({ moved: true, region: region, optionsVisible: true }
      // , () => {
      //   this.optionsVisibleTimeout = setTimeout(() => {
      //     this.setState({ optionsVisible: false })
      //   }, 2500)
      // }
    );
    // }, 100);
  }

  pressedSearchHere = () => {
    this.getData();
  }

  pressedMap() {
    // this.setState({ optionsVisible: true });
    // setTimeout(() => { this.setState({ optionsVisible: true }) }, 2500);
    Keyboard.dismiss();
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

        this.getData();
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
      latitudeDelta: initialZoom.latitudeDelta,
      longitudeDelta: initialZoom.longitudeDelta,
    };

    this.setState({ currentEventIndex: index });
    this.mapViewRef.mapView.animateToRegion(coordinateEvent, 350);
    this.showCallout(index);
  }

  scrollEnded = () => {
    let index = this.myEventScrollList.myScroll.currentIndex;
    this.showEventCardAndMarker(index);
  }

  /*********************************************************************************
   *************************                 ***************************************
   ********************      CREATION  STUFF    ************************************
   *************************                 ***************************************
   ********************************************************************************/


  filterBySport(exit = false) {
    let newEvents = [];
    for (let index = 0; index < this.state.eventsRetrieved.length; index++) {
      const event = this.state.eventsRetrieved[index];
      if (this.state.sportsAccepted.includes(event.event.sport) &&
        (this.state.hostIdFilter == '' || event.event.host_id == this.state.hostIdFilter))
        newEvents.push(event);
    }
    this.setState({ events: [], isChoosingAFilter: !exit }, () => { this.setState({ events: newEvents }) });
  }

}

const mapStateToProps = (state) => {
  return state
}

export default connect(mapStateToProps)(SearchScreen)

