import * as React from 'react';
import { ScrollView, Text, View, Image } from 'react-native';
import { connect } from 'react-redux'
import { styles } from './styles'
import SportCoApi from '../../services/apiService';
import MapView from 'react-native-maps';
import { mapSportIcon } from '../../helpers/mapper';
import CustomIcon from '../../components/Icon';
import { Button, Icon, Overlay } from 'react-native-elements'
import DateTimePicker from '@react-native-community/datetimepicker';
import GoogleMapsAutoComplete from "../../components/GoogleMapsAutoComplete"
import SmoothPicker from "react-native-smooth-picker";
import Bubble from './Bubble'
import { RenderOverlayDateTimePicker, RenderOverlayMinMaxParticipants, RenderSaveButton, RenderMapViewPicker } from './OverlaysEventEdition'

const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
const roadMapStyle = [
  {
    "featureType": "road",
    "elementType": "labels",
    "stylers": [
      {
        "visibility": "on"
      }
    ]
  }
];

class EventScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      editing: false,
      isEditingDate: false,
      isEditingParticipantNumbers: false,
      isEditingMapMarker: false,
      event: {
        event: {
          date: new Date(),
          description: '',
          event_id: '',
          host_id: "",
          participants_max: 2,
          participants_min: 2,
          photo: '',
          sport: 'default',
          spot_id: ''
        },
        host: {
          email: '',
          photo_url: '',
          user_name: '',
          user_id: ''
        },
        spot: {
          spot_id: '',
          spot_name: '',
          spot_longitude: '',
          spot_latitude: '',
        },
        participants: []
      },
      regionPicked: {
        latitude: 43.59,
        longitude: 7.1,
        latitudeDelta: 0.08,
        longitudeDelta: 0.08
      }
    };
    this.apiService = new SportCoApi();
    this.getData();
  }

  componentDidMount() {
    this.getData();
  }


  render() {
    let event = this.state.event;
    let photoUrl = this.state.event.host.photo_url;
    let eventIcon = mapSportIcon(event.event.sport.toLowerCase());
    let date = EventScreen.computeDate(event.event.date);
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="always"
      >
        {this.renderHostHeader(event, photoUrl, eventIcon)}
        <View style={{ flex: 1, alignSelf: 'center', marginTop: 20 }}>
          <View style={styles.descriptionView}>
            <Image
              source={eventIcon.image}
              style={styles.imageSport}
            />
            <View style={{ flexDirection: 'column', flex: 1, marginLeft: 10 }}>
              {this.renderDescriptionText('Description', event.event.description)}
              {this.renderDescriptionText('Date', date)}
              {this.renderDescriptionText('Hôte', event.host.user_name.split(' ')[0])}
              {this.renderDescriptionText('Participants', event.event.participants_min + ' / ' + event.participants.length + ' / ' + event.event.participants_max)}
              <RenderOverlayDateTimePicker
                isEditingDate={this.state.isEditingDate}
                stopEditingDate={() => { this.setState({ isEditingDate: false }) }}
                event={this.state.event}
                onDateChange={this.onDateChange.bind(this)}
                onDateTimeChange={this.onDateTimeChange.bind(this)}
                saveDate={this.saveDate.bind(this)}
              />
              <RenderOverlayMinMaxParticipants
                isEditingParticipantNumbers={this.state.isEditingParticipantNumbers}
                stopEditingParticipantNumbers={() => { this.setState({ isEditingParticipantNumbers: false }) }}
                event={this.state.event}
                onPMinChange={this.updateParticipantMin.bind(this)}
                onPMaxChange={this.updateParticipantMax.bind(this)}
                saveParticipants={this.saveParticipants.bind(this)}
              />
            </View>
          </View>
          <View style={{ marginTop: 20, marginBottom: 20, flex: 1 }}>
            <Text>Vous trouverez ici toutes les informations concernant l'évènement ! L'adresse se trouve via le plan, ou en cliquant sur ce lien : LinkToMap</Text>
          </View>
          {this.renderMapView(event)}
          {this.renderOptions()}
        </View>
        <View style={{ height: 75 }}></View>
      </ScrollView>
    );
  }


  /*********************************************************************************
   *************************                 ***************************************
   ********************      RENDERING STUFF    ************************************
   *************************                 ***************************************
   ********************************************************************************/


  renderHostHeader(event, photoUrl, eventIcon) {
    return (
      <View style={{ flex: 1, flexDirection: 'row' }}>
        <View style={styles.imageContainer}>
          {photoUrl != undefined && <Image source={{ uri: photoUrl + '?type=large&width=500&height=500' }} style={styles.image} />}
          {photoUrl == undefined && <Image source={require('../../assets/images/robot-dev.png')} style={styles.image} />}
        </View>

        <View style={{ flex: 1, justifyContent: 'center', marginLeft: 15, flexDirection: 'row' }}>
          <Text style={{ fontSize: 18, flex: 3 }}>Salut ! Moi c'est {event.host.user_name.split(' ')[0]}, on va faire un {event.event.sport}, n'hésite pas à nous rejoindre !</Text>
          <View style={{ flex: 1, flexDirection: 'row', marginLeft: 20 }}>
            <CustomIcon
              name={eventIcon.iconName}
              type={eventIcon.iconFamily}
              size={30}
              style={{ alignSelf: 'center', flex: 1 }}
              selected={true}
            />
          </View>
        </View>

      </View>
    )
  }

  renderDescriptionText(title, data) {
    return (
      <View style={[{ flex: 1, flexDirection: 'column' }, this.state.editing ? { bottom: 15 } : {}]}>
        <View style={{ flex: 1, flexDirection: 'row' }}>
          {this.state.editing && (
            <Icon
              raised
              name='edit'
              type='font-awesome'
              color='orange'
              size={15}
              onPress={this.editProperty.bind(this, title)} />
          )}
          <Text style={[styles.titleDescription, this.state.editing ? { top: 15 } : {}]}>{title}</Text>
        </View>

        <Text style={styles.titleDescriptionText}>{data}</Text>
      </View>
    )
  }


  renderMapView(event) {
    let eventRegion = {
      latitude: parseFloat(event.spot.spot_latitude),
      longitude: parseFloat(event.spot.spot_longitude),
      latitudeDelta: 0.005,
      longitudeDelta: 0.005
    }
    return (
      <View style={{flex :1}}>
        <RenderMapViewPicker
          isVisible={this.state.isEditingMapMarker}
          stopEditingMapMarker={this.stopEditingMapMarker.bind(this)}
          goToLocation={this.goToLocation.bind(this)}
          regionPicked={!isNaN(eventRegion.latitude)? eventRegion : this.state.regionPicked}
          onRegionChange={(region) => { this.setState({ regionPicked: region }) }}
          saveLocation={this.saveLocation.bind(this)}
        />
        <View>
          {this.renderDescriptionText('Localisation', '')}
          {!isNaN(eventRegion.latitude) ? (
            <MapView
              style={styles.mapStyle}
              pitchEnabled={false}
              rotateEnabled={false}
              zoomEnabled={true}
              scrollEnabled={false}
              initialRegion={eventRegion}
              provider={"google"}
              customMapStyle={roadMapStyle}>

              <MapView.Marker
                coordinate={eventRegion}
                onPress={() => { }}
              />
            </MapView>
          ) :
            <Text>Choisissez une localisation</Text>}
        </View>
      </View>
    )
  }

  renderOptions() {
    return (
      <View style={{ flex: 1, flexDirection: 'row', marginTop: 10, alignSelf: 'center' }}>
        <View style={{ borderRadius: 10 }} >
          {this.isOrganizedByMe() ? (
            <View>

              {this.state.editing ? (
                <View>
                  <RenderSaveButton
                    title={`| Let's do it !`}
                    callback={this.updateEvent.bind(this)}
                  />
                </View>
              ) : (
                  <View style={{ flexDirection: 'row' }} >
                    <EventIcon name='edit' callback={this.editEvent.bind(this)}/>
                    <EventIcon name='remove' color='red' callback={this.editEvent.bind(this)}/>
                  </View>
                )}
            </View>
          ) : (
              !this.state.alreadyJoined ?
                <Button title={"Rejoindre l'évènement !"} onPress={this.joinEvent.bind(this)} />
                :
                <Button buttonStyle={{ backgroundColor: 'green' }} icon={
                  <Icon
                    name="check"
                    size={15}
                    color="white"
                    type='font-awesome'
                  />} title={`| Annuler?`} onPress={this.leaveEvent.bind(this)} />
            )}
        </View>
      </View>
    )
  }




  /*********************************************************************************
   *************************                 ***************************************
   ********************      DATA  **  STUFF    ************************************
   *************************                 ***************************************
   ********************************************************************************/


  getData() {
    let event = !this.isEmpty(this.props.route.params.event) ? this.props.route.params.event : this.state.event;
    let eventId = (event.event.event_id == "") ? -1 : event.event.event_id;
    this.apiService.getSingleEntity("events", eventId)
      .then((eventData) => {
        this.apiService.getSingleEntity("users/email", this.props.auth.user.email)
          .then((data) => {
            this.setState({
              event: eventData.data,
              loggedUser_id: data.data.user_id,
              alreadyJoined: this.computeAlreadyJoined(data.data.user_id, eventData.data.participants),
              editing: false
            });
          });
      })
      .catch((error) => {
        //Creation flow ongoing
        this.apiService.getSingleEntity("users/email", this.props.auth.user.email)
          .then((data) => {
            let loggedUser_id = data.data.user_id;
            let newState = {
              loggedUser_id: loggedUser_id,
              editing: true,
              event: {
                ...this.state.event,
                event: {
                  ...this.state.event.event,
                  host_id: loggedUser_id
                },
                host: data.data

              }
            };
            this.setState(newState);
          });
      })
  }

  joinEvent() {
    let eventP = {
      user_id: this.state.loggedUser_id,
      event_id: this.state.event.event.event_id
    }
    this.apiService.addEntity('eventparticipant', eventP)
      .then((data) => {
        this.getData();
      })
  }

  leaveEvent() {
    let eventP = {
      user_id: this.state.loggedUser_id,
      event_id: this.state.event.event.event_id
    }
    this.apiService.deleteEntity('eventparticipant', eventP)
      .then((data) => {
        this.getData();
      })
  }

  editEvent() {
    this.setState({ editing: true })
  }

  editProperty(property) {
    switch (property) {
      case 'Date':
        this.setState({ isEditingDate: true })
        break;
      case 'Participants':
        this.setState({ isEditingParticipantNumbers: true })
        break;
      case 'Localisation':
        this.setState({ isEditingMapMarker: true })
        break;
      default:
        break;
    }
  }

  saveDate() {
    this.setState({ isEditingDate: false })
  }

  saveParticipants() {
    this.setState({ isEditingParticipantNumbers: false })
  }

  onDateChange(e, date) {
    let newDate = new Date(date);
    let currentDate = new Date(this.state.event.event.date);
    newDate.setHours(currentDate.getHours());
    newDate.setMinutes(currentDate.getMinutes());
    newDate.setSeconds(currentDate.getSeconds());
    let newEvent = {
      event: {
        ...this.state.event,
        event: {
          ...this.state.event.event,
          date: newDate
        }
      }
    }
    this.setState(newEvent);
  }
  onDateTimeChange(event, datetime) {
    let newDate = new Date(datetime);
    let currentDate = new Date(this.state.event.event.date);
    newDate.setDate(currentDate.getDate());
    let newEvent = {
      event: {
        ...this.state.event,
        event: {
          ...this.state.event.event,
          date: newDate
        }
      }
    }
    this.setState(newEvent);
  }

  stopEditingMapMarker() {
    this.setState({ isEditingMapMarker: false })
  }

  saveLocation() {
    let updatedEventWithSpot = {
      ...this.state,
      isEditingMapMarker: false,
      event: {
        ...this.state.event,
        spot: {
          ...this.state.event.spot,
          spot_longitude: this.state.regionPicked.longitude,
          spot_latitude: this.state.regionPicked.latitude
        }
      }
    }
    this.setState(updatedEventWithSpot);
  }

  updateParticipantMin(item, index) {
    let updatedEventWithParticipantMin = {
      ...this.state,
      event: {
        ...this.state.event,
        event: {
          ...this.state.event.event,
          participants_min: item
        }
      }
    }
    this.setState(updatedEventWithParticipantMin);
  }

  updateParticipantMax(item, index) {
    let updatedEventWithParticipantMax = {
      ...this.state,
      event: {
        ...this.state.event,
        event: {
          ...this.state.event.event,
          participants_max: item
        }
      }
    }
    this.setState(updatedEventWithParticipantMax);
  }


  updateEvent() {
    //avoid setState as we just want to set in DB and then getData !
    //TODO : check if there's not easier...
    this.state.event.event.date.setMinutes(this.state.event.event.date.getMinutes() - this.state.event.event.date.getTimezoneOffset());
    if (this.state.event.event.event_id == '') {
      // Get Spot from region (create if not exist)
      // Then add spotId to event
      this.apiService.getEntities("spots/coordinates", this.state.regionPicked)
        .then((data) => {
          if (data.data.length != 0) {
            let updatedEventWithSpot = {
              event: {
                ...this.state.event,
                event: {
                  ...this.state.event.event,
                  spot_id: data.data[0].spot_id
                },
                spot: data.data[0]
              }
            }
            this.apiService.addEntity('events', updatedEventWithSpot.event.event)
              .then((res) => {
                let newState = {
                  editing: false,
                  event: {
                    ...updatedEventWithSpot.event,
                    event: {
                      ...updatedEventWithSpot.event.event,
                      event_id: res.data.data.event_id
                    }
                  }
                };
                this.setState(newState, () => { this.getData() });
              })
              .catch((error) => {
                console.log(error)
              })
          } else {
            //Spot is unknown yet, let's add it and retry
            this.apiService.addEntity('spots', this.state.event.spot)
              .then((data) => {
                this.updateEvent();
              })

          }
        })
        .catch((error) => {

        })

    } else {
      this.apiService.editEntity('events', this.state.event.event)
        .then(() => {
          this.getData();
        })
    }
  }

  cancelEvent() { }


  /*********************************************************************************
   *************************                 ***************************************
   ********************      HELPERS   STUFF    ************************************
   *************************                 ***************************************
   ********************************************************************************/


  goToLocation(lat, lon) {
    //Only coming from autoComplete
    this.setState(
      {
        regionPicked: {
          ...this.state.regionPicked,
          latitude: lat,
          longitude: lon,
        },
      }
      , () => {
        var coordinatesZommed = {
          latitude: lat,
          longitude: lon,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }
        this.mapView.animateToRegion(coordinatesZommed, 1500);

      });
  }

  isOrganizedByMe() {
    return this.state.loggedUser_id == this.state.event.event.host_id;
  }

  computeAlreadyJoined(userId, participants) {
    for (let index = 0; index < participants.length;) {
      const participant = participants[index];
      if (participant.user_id == userId)
        return true;
    }
    return false;
  }

  static computeDate(dateData) {
    let date = new Date(dateData);
    let dateString = date.toLocaleDateString(undefined, dateOptions);
    let time = date.toLocaleTimeString().split(':');
    let hour = time[0] + 'h' + time[1];
    return dateString.charAt(0).toUpperCase() + dateString.slice(1) + ' ' + hour;
  }

  isEmpty(obj) {
    for (var prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        return false;
      }
    }

    return JSON.stringify(obj) === JSON.stringify({});
  }
}

class EventIcon extends React.Component {
  render() {
    return (
      <Icon
        raised
        name={this.props.name}
        type='font-awesome'
        color={this.props.color || 'orange'}
        onPress={this.props.callback} />
        )
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch: (action) => { dispatch(action) }
  }
}

const mapStateToProps = (state) => {
  return state
}

export default connect(mapStateToProps, mapDispatchToProps)(EventScreen)

