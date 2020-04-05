import * as React from 'react';
import { ScrollView, Text, View, Image } from 'react-native';
import { connect } from 'react-redux'
import { styles } from './styles'
import SportCoApi from '../../services/apiService';
import MapView from 'react-native-maps';
import { mapSportIcon } from '../../helpers/mapper';
import CustomIcon from '../../components/Icon';
import { Button, Icon } from 'react-native-elements'
import { RenderOverlayDateTimePicker, RenderOverlayMinMaxParticipants, RenderOverlayDescription, RenderSaveButton, RenderMapViewPicker } from './OverlaysEventEdition'
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
      editing: false,
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
        <TouchableWithoutFeedback onPress={this.seeHostProfile.bind(this)}>
          <View style={styles.imageContainer}>
            {photoUrl != undefined && <Image source={{ uri: photoUrl + '?type=large&width=500&height=500' }} style={styles.image} />}
            {photoUrl == undefined && <Image source={require('../../assets/images/robot-dev.png')} style={styles.image} />}
          </View>
        </TouchableWithoutFeedback>

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
              onPress={this.setEditingProperty.bind(this, title, true)} />
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
        <RenderMapViewPicker
          isVisible={this.state.isEditingMapMarker}
          stopEditingMapMarker={this.setEditingProperty.bind(this, 'Localisation', false)}
          regionPicked={!isNaN(eventRegion.latitude) ? eventRegion : this.state.regionPicked}
          onRegionChange={(region) => { this.setState({ regionPicked: region }) }}
          saveLocation={this.setStateProperty.bind(this, 'spot', 'WHOLE', null)}
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
                <View>
                  <RenderSaveButton
                    title={`| Let's do it !`}
                    callback={this.updateEvent.bind(this)}
                  />
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
    this.setState({ editing: true })
  }

  setEditingProperty(property, doneornot) {
    switch (property) {
      case 'Date':
        this.setState({ isEditingDate: doneornot })
        break;
      case 'Participants':
        this.setState({ isEditingParticipantNumbers: doneornot })
        break;
      case 'Description':
        this.setState({ isEditingDescription: doneornot })
        break;
      case 'Localisation':
        this.setState({ isEditingMapMarker: doneornot })
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
      this.state.event.event.date.setMinutes(this.state.event.event.date.getMinutes() - this.state.event.event.date.getTimezoneOffset());
      this.apiService.editEntity('events', this.state.event.event)
        .then(() => {
          this.getData();
        })
    }
  }

  cancelEvent() {
    this.apiService.deleteEntity('events', this.state.event.event)
      .then((data) => {
        this.props.navigation.goBack();
      });
  }

  seeHostProfile() {
    this.props.navigation.navigate('Profile', { email: this.state.event.host.email });
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

