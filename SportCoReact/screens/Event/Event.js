import * as React from 'react';
import { ScrollView, Text, View, Image, RefreshControl } from 'react-native';
import { connect } from 'react-redux'
import { styles } from './styles'
import SportCoApi from '../../services/apiService';
import MapView from 'react-native-maps';
import { mapSportIcon } from '../../helpers/mapper';
import CustomIcon from '../../components/Icon';
import { Button, Icon } from 'react-native-elements'
import { RenderOverlayDateTimePicker, RenderOverlayMinMaxParticipants, RenderOverlayDescription, RenderSaveButton, RenderMapViewSpotPicker, RenderOverlaySport } from './OverlaysEventEdition'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

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
      refreshing: false,
      editing: false,
      isEditingSport: false,
      isEditingDate: false,
      isEditingParticipantNumbers: false,
      isEditingDescription: false,
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
          sport: 'basket',
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
      eventBeforeEdit: {},
      regionPicked: {

      },
      initialRegion: {}
    };
    this.apiService = new SportCoApi();
    //this.getData();
  }

  componentDidMount() {
    this.watchId = navigator.geolocation.watchPosition(
      this.setCurrentPosition.bind(this),
      () => { console.log('setPosError') },
      {
        enableHighAccuracy: true,
        timeout: 1000,
        maximumAge: 0
      }

    );
  }

  setCurrentPosition(position) {
    navigator.geolocation.clearWatch(this.watchId);
    let region = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      latitudeDelta: 0.08,
      longitudeDelta: 0.08
    };
    this.setState(
      {
        ...this.state,
        initialRegion: region,
        regionPicked: region
      }, () => {
        this.getData()
      });
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
        refreshControl={
          <RefreshControl refreshing={this.state.refreshing} onRefresh={this.getData.bind(this)} />
        }>

        {this.renderHostHeader(event, photoUrl, eventIcon)}
        <View style={{ flex: 1, width: '100%', alignSelf: 'center', marginTop: 20 }}>
          <View style={styles.descriptionView}>
            <Image
              source={eventIcon.image}
              style={styles.imageSport}
            />
            <View style={{ flexDirection: 'column', flex: 1, marginLeft: 10 }}>
              {this.renderDescriptionText('Description', event.event.description)}
              {this.renderDescriptionText('Date', date)}
              {this.renderDescriptionText('Hôte', event.host.user_name.split(' ')[0])}
              <View style={{ flexDirection: 'row' }}>
                {this.renderDescriptionText('Min', event.event.participants_min, 'flex-start')}
                {this.renderDescriptionText('Going', event.participants.length, 'center',false)}
                {this.renderDescriptionText('Max', event.event.participants_max, 'flex-end')}
              </View>
              <RenderOverlayDateTimePicker
                isEditingDate={this.state.isEditingDate}
                stopEditingDate={() => { this.setState({ isEditingDate: false }) }}
                event={this.state.event}
                onDateChange={this.setStateProperty.bind(this, 'event', 'date')}
                onDateTimeChange={this.setStateProperty.bind(this, 'event', 'datetime')}
                saveDate={this.setEditingProperty.bind(this, 'Date', false)}
              />
              <RenderOverlayMinMaxParticipants
                isEditingParticipantNumbers={this.state.isEditingParticipantNumbers}
                stopEditingParticipantNumbers={() => { this.setState({ isEditingParticipantNumbers: false }) }}
                event={this.state.event}
                onPMinChange={this.setStateProperty.bind(this, 'event', 'participants_min')}
                onPMaxChange={this.setStateProperty.bind(this, 'event', 'participants_max')}
                saveParticipants={this.setEditingProperty.bind(this, 'Participants', false)}
              />
              <RenderOverlayDescription
                isEditingDescription={this.state.isEditingDescription}
                stopEditingDescription={() => { this.setState({ isEditingDescription: false }) }}
                description={this.state.event.event.description}
                onDescriptionChange={this.setStateProperty.bind(this, 'event', 'description')}
                saveDescription={this.setEditingProperty.bind(this, 'Description', false)}
              />
            </View>
          </View>
          {this.renderOptions()}
          {this.renderParticipants()}
          <View style={{ marginTop: 20, marginBottom: 20, flex: 1 }}>
            <Text>Vous trouverez ici toutes les informations concernant l'évènement ! L'adresse se trouve via le plan, ou en cliquant sur ce lien : LinkToMap</Text>
          </View>
          {this.renderMapView(event)}
        </View>
        <View style={{ height: 100 }}></View>
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
        <TouchableWithoutFeedback onPress={this.seeProfile.bind(this, this.state.event.host.email)}>
          <View style={styles.imageContainer}>
            {photoUrl != undefined && <Image source={{ uri: photoUrl + '?type=large&width=500&height=500' }} style={styles.image} />}
            {photoUrl == undefined && <Image source={require('../../assets/images/robot-dev.png')} style={styles.image} />}
          </View>
        </TouchableWithoutFeedback>

        <View style={{ flex: 1, justifyContent: 'center', marginLeft: 15, flexDirection: 'row' }}>
          <Text style={{ fontSize: 18, flex: 3 }}>Salut ! Moi c'est {event.host.user_name.split(' ')[0]}, on va faire un {event.event.sport}, n'hésite pas à nous rejoindre !</Text>
          <View style={{ flex: 1, flexDirection: 'column' }}>
            <CustomIcon
              name={eventIcon.iconName}
              type={eventIcon.iconFamily}
              size={30}
              style={{ alignSelf: 'center', flex: 1 }}
              selected={true}
            />
            {this.state.editing && (
              <Icon
                raised
                name='edit'
                type='font-awesome'
                color='orange'
                size={15}
                style={{ bottom: -20, right: -20 }}
                onPress={this.setEditingProperty.bind(this, 'Sport', true)} />
            )}
            <RenderOverlaySport
              isEditingSport={this.state.isEditingSport}
              stopEditingSport={() => { this.setState({ isEditingSport: false }) }}
              sport={this.state.event.event.sport}
              onSportChange={this.setStateProperty.bind(this, 'event', 'sport')}
              saveSport={this.setEditingProperty.bind(this, 'Sport', false)}
            />
          </View>
        </View>

      </View>
    )
  }

  renderDescriptionText(title, data, centered = 'auto', isMutable = true) {
    return (
      <View style={[
        { flex: 1, flexDirection: 'column' },
        this.state.editing ? { bottom: 15 } : {},
      ]}>
        <View style={{ flex: 1, flexDirection: 'row' }}>
          {this.state.editing && isMutable && (
            <Icon
              raised
              name='edit'
              type='font-awesome'
              color='orange'
              size={15}
              onPress={this.setEditingProperty.bind(this, title, true)} />
          )}
          <Text style={[styles.titleDescription, centered != 'auto' ? { textAlign: 'center' } : {}, this.state.editing ? { top: 15 } : {}]}>{title}</Text>
        </View>
        <Text style={[styles.titleDescriptionText, centered != 'auto' ? { alignSelf: 'center' } : {}]}>{data}</Text>
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
      <View style={{ flex: 1 }}>
        <View>
          {this.renderDescriptionText('Localisation', '')}
          {!isNaN(eventRegion.latitude) ? (
            <MapView
              style={styles.mapStyle}
              pitchEnabled={false}
              rotateEnabled={false}
              zoomEnabled={true}
              scrollEnabled={false}
              showsUserLocation={true}
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
        <RenderMapViewSpotPicker
          isVisible={this.state.isEditingMapMarker}
          stopEditingMapMarker={this.setEditingProperty.bind(this, 'Localisation', false)}
          regionPicked={!isNaN(eventRegion.latitude) ? eventRegion : this.state.regionPicked}
          onRegionChange={(region) => { this.setState({ regionPicked: region }) }}
          saveLocation={this.setStateProperty.bind(this, 'spot', 'WHOLE', null)}
          selectedSpot={this.setStateProperty.bind(this, 'spot', 'WHOLE', null)}
        />
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
                <View style={{ flexDirection: 'row' }} >
                  <RenderSaveButton
                    title={`| Let's do it !`}
                    callback={this.updateEvent.bind(this)}
                  />
                  <View style={{ bottom: 15 }}>
                    <EventIcon name='remove' color='red' callback={this.cancelEdit.bind(this)} />
                  </View>
                </View>
              ) : (
                  <View style={{ flexDirection: 'row' }} >
                    <EventIcon name='edit' callback={this.editEvent.bind(this)} />
                    <EventIcon name='remove' color='red' callback={this.cancelEvent.bind(this)} />
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

  renderParticipants() {
    return (
      <View >
        {this.renderDescriptionText('Participants', '')}
        <View style={{ flexDirection: 'row' }}>
          {this.state.event.participants.map((participant, index) => {
            let photoUrl = participant.photo_url;
            return (
              <View key={'participant-' + index} style={{ flexDirection: 'column', marginHorizontal: 10, justifyContent: 'center', alignItems: 'center' }}>
                <TouchableWithoutFeedback onPress={this.seeProfile.bind(this, participant.email)}>
                  <View style={styles.imageContainerParticipant}>
                    {photoUrl != undefined && <Image source={{ uri: photoUrl + '?type=large&width=500&height=500' }} style={styles.imageParticipant} />}
                    {photoUrl == undefined && <Image source={require('../../assets/images/robot-dev.png')} style={styles.imageParticipant} />}
                  </View>
                </TouchableWithoutFeedback>
                <Text numberOfLines={1} style={{ alignSelf: 'center', marginBottom: 10, width: 50 }}>{participant.user_name}</Text>
              </View>
            )
          })}
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
    this.setState({ refreshing: true }, () => {
      let event = !this.isEmpty(this.props.route.params.event) ? this.props.route.params.event : this.state.event;
      let eventId = (event.event.event_id == "") ? -1 : event.event.event_id;
      this.apiService.getSingleEntity("events", eventId)
        .then((eventData) => {
          this.apiService.getSingleEntity("users/email", this.props.auth.user.email)
            .then((data) => {
              this.setState({
                refreshing: false,
                event: eventData.data,
                loggedUser_id: data.data.user_id,
                alreadyJoined: this.computeAlreadyJoined(data.data.user_id, eventData.data.participants),
                editing: false
              });
            })
            .catch((error) => {
              this.setState({
                refreshing: false
              });
            });
        })
        .catch((error) => {
          //Creation flow ongoing
          this.apiService.getSingleEntity("users/email", this.props.auth.user.email)
            .then((data) => {

              let loggedUser_id = data.data.user_id;
              let newState = {
                refreshing: false,
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
            })
            .catch((error) => {
              this.setState({
                refreshing: false
              });
            });;
        })
    });
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
    this.apiService.editEntity('userstats',
      {
        user_id: this.state.loggedUser_id,
        statToUpdate: this.state.event.event.sport + '_joined'
      });
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
    this.setState({ editing: true, eventBeforeEdit: this.state.event })
  }

  setEditingProperty(property, doneornot) {
    switch (property) {
      case 'Sport':
        this.setState({ isEditingSport: doneornot })
        break;
      case 'Date':
        this.setState({ isEditingDate: doneornot })
        break;
      case 'Min':
      case 'Max':
        this.setState({ isEditingParticipantNumbers: doneornot })
        break;
      case 'Description':
        this.setState({ isEditingDescription: doneornot })
        break;
      case 'Localisation':
        this.setState({ isEditingMapMarker: doneornot, regionPicked: this.state.initialRegion })
        break;
      default:
        break;
    }
  }

  setStateProperty(parentProperty, property, value, dateValueIfDate = null) {
    let newEvent = this.state.event;
    let newValue = value;
    let newProperty = property;
    let newDate = new Date(dateValueIfDate);
    let currentDate = new Date(this.state.event.event.date);
    switch (property) {
      case 'date':
        newDate.setHours(currentDate.getHours());
        newDate.setMinutes(currentDate.getMinutes());
        newDate.setSeconds(currentDate.getSeconds());
        newValue = newDate;
        break;
      case 'datetime':
        newDate.setDate(currentDate.getDate());
        newValue = newDate;
        newProperty = 'date';
        break;
      case 'WHOLE':
        //Only for map picking location so far
        this.setEditingProperty('Localisation', false);
        newValue = {
          ...this.state.event.spot,
          spot_longitude: this.state.regionPicked.longitude,
          spot_latitude: this.state.regionPicked.latitude
        };
        break;
      default:
        break;
    }
    if (newProperty == 'WHOLE')
      newEvent[parentProperty] = newValue;
    else
      newEvent[parentProperty][newProperty] = newValue;
    this.setState({ event: newEvent });
  }


  updateEvent() {
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
                this.apiService.editEntity('userstats',
                  {
                    user_id: this.state.event.host.user_id,
                    statToUpdate: this.state.event.event.sport + '_created',
                  });
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
      //avoid setState as we just want to set in DB and then getData !
      //TODO : check if there's not easier...
      //this.state.event.event.date.setMinutes(this.state.event.event.date.getMinutes() - this.state.event.event.date.getTimezoneOffset());

      this.state.event.event['reason_for_update'] = 'EVENT_CHANGED';
      this.state.event.event['data_name'] = 'event_id';

      this.apiService.editEntity('events', this.state.event.event)
        .then(() => {
          this.getData();
        })
    }
  }

  cancelEdit() {
    this.setState({ editing: false, event: this.state.eventBeforeEdit });
  }

  cancelEvent() {
    this.state.event.event['reason_for_update'] = 'EVENT_CANCELED';
    this.state.event.event['data_name'] = 'event_id';

    this.apiService.deleteEntity('events', this.state.event.event)
      .then((data) => {
        this.props.navigation.goBack();
      });
  }

  seeProfile(email) {
    this.props.navigation.navigate('Profile', { email: email });
  }


  /*********************************************************************************
   *************************                 ***************************************
   ********************      HELPERS   STUFF    ************************************
   *************************                 ***************************************
   ********************************************************************************/


  isOrganizedByMe() {
    return this.state.loggedUser_id == this.state.event.event.host_id;
  }

  computeAlreadyJoined(userId, participants) {
    for (let index = 0; index < participants.length; index++) {
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

export class EventIcon extends React.Component {
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

