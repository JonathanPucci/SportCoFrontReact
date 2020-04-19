import * as React from 'react';
import { Text, View, Image, RefreshControl, Platform, Share, Linking } from 'react-native';
import { connect } from 'react-redux'
import { styles } from './styles'
import SportCoApi from '../../services/apiService';
import { mapSportIcon } from '../../helpers/mapper';
import { Button, Icon } from 'react-native-elements'
import { OverlayDateTimePicker, OverlayMinMaxParticipants, OverlayDescription, OverlayLevel, OverlaySport } from './OverlaysEventEdition'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { LEVELS } from '../../constants/DbConstants.js'
import { createOpenLink } from 'react-native-open-maps';
import { seeProfile, isEmpty, computeDate } from './Helpers'
import * as EventApi from './EventApi';
import { Comments } from "./Comments/Comments";
import { DescriptionText } from "./DescriptionText/DescriptionText";
import { EventMapView } from './EventMapView/EventMapView';
import { Participants } from './Participants/Participants';
import { Options } from './Options/Options';
import { OptionIcon } from './OptionIcon';
import Geolocation from 'react-native-geolocation-service';

const newEmptyEvent = {
  event: {
    event_id: '',
    description: '',
    spot_id: '',
    participants_max: 6,
    participants_min: 2,
    sport: 'basket',
    date: new Date(),
    visibility: 'public',
    sport_level: 'intermediate'
  },
  host: {},
  participants: [],
  comments: [],
  spot: {}
}

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
      isEditingLevel: false,
      regionPicked: {},
      initialRegion: {}
    };
    this.apiService = new SportCoApi();
    this.addComment = EventApi.addComment.bind(this);
    this.validateComment = EventApi.validateComment.bind(this);
    this.onCommentChangeText = EventApi.onCommentChangeText.bind(this);
    this.cancelComment = EventApi.cancelComment.bind(this);
    this.joinEvent = EventApi.joinEvent.bind(this);
    this.leaveEvent = EventApi.leaveEvent.bind(this);
    this.cancelEvent = EventApi.cancelEvent.bind(this);
    this.updateEvent = EventApi.updateEvent.bind(this);
  }

  componentDidMount() {
    this.watchId = Geolocation.watchPosition(
      this.setCurrentPosition,
      () => { console.log('setPosError') },
      {
        enableHighAccuracy: true,
        timeout: 1000,
        maximumAge: 0
      }
    );
  }

  getInitEventData = () => {
    return { ...this.props.eventDataFromStore };
  }

  setCurrentPosition = async (position) => {
    Geolocation.clearWatch(this.watchId);
    let region = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      latitudeDelta: 0.08,
      longitudeDelta: 0.08
    };
    const data = await this.getData();
    const initEventData = this.getInitEventData();
    this.setState(
      {
        ...this.state,
        initialRegion: region,
        regionPicked: region,
        eventData: initEventData
      }
    );
  }

  /**********************************************************************************
   ********************         RENDER             **********************************
   *********************************************************************************/

  render() {
    let eventData = this.state.eventData;
    if (eventData == undefined || eventData.event == undefined)
      return <View></View>
    let photoUrl = eventData.host.photo_url;
    let eventIcon = mapSportIcon(eventData.event.sport.toLowerCase());
    let date = computeDate(eventData.event.date);
    return (
      <KeyboardAwareScrollView
        extraScrollHeight={150}
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl refreshing={this.state.refreshing} onRefresh={this.getData} />
        }>

        {this.renderHostHeader(eventData, photoUrl, eventIcon)}
        <View style={{ flex: 1, width: '100%', alignSelf: 'center', marginTop: 20 }}>
          <View style={styles.descriptionView}>
            <View style={{ flex: 1, flexDirection: 'column' }}>
              <Image
                source={eventIcon.image}
                style={styles.imageSport}
              />
              <View style={{ marginTop: 20 }}>
                <DescriptionText
                  title='Visibility'
                  data={eventData.event.visibility.toUpperCase()}
                  editing={this.state.editing}
                  setEditingProperty={this.setEditingProperty}
                />
              </View>
            </View>
            <View style={{ flexDirection: 'column', flex: 1, marginLeft: 10 }}>
              {this.renderDescriptionText('Description', eventData.event.description)}
              {this.renderDescriptionText('Date', date)}
              {this.renderDescriptionText('Level', eventData.event.sport_level.toLocaleUpperCase())}
              <View style={{ flexDirection: 'row', marginLeft: -20 }}>
                {this.renderDescriptionText('Min', eventData.event.participants_min, true)}
                {this.renderDescriptionText('Going', eventData.participants.length, true, false)}
                {this.renderDescriptionText('Max', eventData.event.participants_max, true, false)}
              </View>
              <OverlayDescription
                isEditingDescription={this.state.isEditingDescription}
                stopEditingDescription={() => this.setEditingProperty('Description', false)}
                description={eventData.event.description}
                onDescriptionChange={(desc) => this.setStateEventDataProperty('event', 'description', desc)}
                saveDescription={() => this.setEditingProperty('Description', false)}
              />
              <OverlayDateTimePicker
                isEditingDate={this.state.isEditingDate}
                stopEditingDate={() => this.setEditingProperty('Date', false)}
                event={eventData}
                onDateChange={(e, d) => this.setStateEventDataProperty('event', 'date', null, d)}
                onDateTimeChange={(e, dt) => this.setStateEventDataProperty('event', 'datetime', null, dt)}
                saveDate={() => this.setEditingProperty('Date', false)}
              />
              <OverlayLevel
                isEditingLevel={this.state.isEditingLevel}
                stopEditingLevel={() => this.setEditingProperty('Level', false)}
                level={eventData.event.sport_level}
                levels={LEVELS}
                onLevelChange={(level) => this.setStateEventDataProperty('event', 'sport_level', level)}
                saveLevel={() => this.setEditingProperty('Level', false)}
              />
              <OverlayMinMaxParticipants
                isEditingParticipantNumbers={this.state.isEditingParticipantNumbers}
                stopEditingParticipantNumbers={() => this.setEditingProperty('Participants', false)}
                event={eventData}
                onPMinChange={(min) => this.setStateEventDataProperty('event', 'participants_min', min)}
                onPMaxChange={(max) => this.setStateEventDataProperty('event', 'participants_max', max)}
                saveParticipants={() => this.setEditingProperty('Participants', false)}
              />
            </View>
          </View>
          <Participants
            eventData={this.state.eventData}
            editing={this.state.editing}
            setEditingProperty={this.setEditingProperty}
            navigation={this.props.navigation} />
          <View style={{ alignSelf: 'center' }}>
            <Text style={{ textAlign: 'center', fontSize: 18 }}> Share </Text>
            <OptionIcon callback={this.onShare} size={20} name="share" color={'blue'} />
          </View>
          <EventMapView
            eventData={this.state.eventData}
            editing={this.state.editing}
            regionPicked={this.state.regionPicked}
            isEditingMapMarker={this.state.isEditingMapMarker}
            setEditingProperty={this.setEditingProperty}
            setStateEventDataProperty={this.setStateEventDataProperty}
            regionChanged={(region) => this.setState({ regionPicked: region })}
          />
          <View style={{ marginTop: 20, marginBottom: 20, flex: 1 }}>
            <Button
              color={'#bdc3c7'}
              onPress={Platform.OS == 'ios' ?
                createOpenLink({
                  latitude: parseFloat(eventData.spot.spot_latitude),
                  longitude: parseFloat(eventData.spot.spot_longitude),
                  query: 'Oh yeah'
                }) :
                createOpenLink({
                  query: (eventData.spot.spot_latitude + ',' + eventData.spot.spot_longitude)
                })
              }
              title="Click To Open in Maps" />
          </View>
          <Comments
            comments={this.state.eventData.comments}
            addComment={this.addComment}
            validateComment={this.validateComment}
            onCommentChangeText={this.onCommentChangeText}
            cancelComment={this.cancelComment}
            setEditingProperty={this.setEditingProperty}
          />
        </View>
        <View style={{ height: 200 }}></View>
      </KeyboardAwareScrollView>
    );
  }


  renderDescriptionText = (title, data, centered = false, isMutable = true) => {
    return (
      <DescriptionText
        title={title}
        data={data}
        editing={this.state.editing}
        setEditingProperty={this.setEditingProperty}
        sport={this.state.eventData.event.sport}
        centered={centered ? 'center' : 'auto'}
        isMutable={isMutable} />
    )
  }

  /*********************************************************************************
   ********************      RENDERING HEADER   ************************************
   ********************************************************************************/

  renderHostHeader(event, photoUrl, eventIcon) {
    return (
      <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
        <TouchableWithoutFeedback onPress={() => seeProfile(this.props.navigation, this.state.eventData.host.email)}>
          <View style={styles.imageContainer}>
            {photoUrl != undefined && <Image source={{ uri: photoUrl + '?type=large&width=500&height=500' }} style={styles.image} />}
            {photoUrl == undefined && <Image source={require('../../assets/images/robot-dev.png')} style={styles.image} />}
          </View>
        </TouchableWithoutFeedback>

        <View style={{
          justifyContent: 'center', alignItems: 'center'
        }}>
          {/* <Text style={{ fontSize: 18 }}>{event.event.sport.toUpperCase()}</Text> */}
          <Options
            eventData={this.state.eventData}
            user_id={this.props.auth.user_id}
            editing={this.state.editing}
            updateEvent={this.updateEvent}
            cancelEvent={this.cancelEvent}
            editEvent={this.editEvent}
            cancelEdit={this.cancelEdit}
            joinEvent={this.joinEvent}
            leaveEvent={this.leaveEvent}
          />

        </View>
        <View style={{ flexDirection: 'column', alignSelf: 'center', alignItems: 'center' }}>
          <Icon
            name={eventIcon.iconName}
            type={eventIcon.iconFamily}
            size={80}
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
              onPress={() => this.setEditingProperty('Sport', true)} />
          )}
        </View>
        <OverlaySport
          isEditingSport={this.state.isEditingSport}
          stopEditingSport={() => { this.setState({ isEditingSport: false }) }}
          sport={this.state.eventData.event.sport}
          onSportChange={(sport) => this.setStateEventDataProperty('event', 'sport', sport)}
          saveSport={() => this.setEditingProperty('Sport', false)}
        />
      </View>
    )
  }

  onShare = async () => {
    // let redirectUrl = await Linking.makeUrl('exp://127.0.0.1:19000', { event: { event_id: '1' } });
    // console.log(redirectUrl);
    try {
      const result = await Share.share({
        message:
          'You should have a look at this event !',
        url: 'exp://localhost:19000?event_id=' + this.state.eventData.event.event_id
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };

  /*********************************************************************************
   ********************      DATA  **  STUFF    ************************************
   ********************************************************************************/

  getData = async () => {
    let eventData = !isEmpty(this.props.route.params.eventData) ? this.props.route.params.eventData : this.state.eventData;
    let eventId = (eventData.event.event_id == "") ? -1 : eventData.event.event_id;
    try {
      const eventData = await this.apiService.getSingleEntity("events", eventId)
      const action = {
        type: "SAVE_EVENT_BEFORE_EDIT",
        value: eventData.data,
      };
      this.props.dispatch(action);
      this.setState({
        refreshing: false,
        editing: false
      });
    }
    catch (error) {
      //Creation flow ongoing
      try {
        const data = await this.apiService.getSingleEntity("users/email", this.props.auth.user.email)
        let eventData = {
          ...newEmptyEvent,
          event: {
            ...newEmptyEvent.event,
            host_id: this.props.auth.user_id
          },
          host: data.data
        }
        // console.log(eventData);

        const action = {
          type: "SAVE_EVENT_BEFORE_EDIT",
          value: eventData,
        };
        this.props.dispatch(action);
        this.setState({
          refreshing: false,
          editing: true
        });
      } catch (error) {
        this.setState({
          refreshing: false,
          editing: false
        });
      };
    }
  }

  setEditingProperty = (property, isEditing) => {
    switch (property) {
      case 'Sport':
        this.setState({ isEditingSport: isEditing })
        break;
      case 'Date':
        this.setState({ isEditingDate: isEditing })
        break;
      case 'Min':
      case 'Participants':
      case 'Max':
        this.setState({ isEditingParticipantNumbers: isEditing })
        break;
      case 'Description':
        this.setState({ isEditingDescription: isEditing })
        break;
      case 'Level':
        this.setState({ isEditingLevel: isEditing })
        break;
      case 'Localisation':
        this.setState({ isEditingMapMarker: isEditing, regionPicked: this.state.initialRegion })
        break;
      case 'Visibility':
        this.setStateEventDataProperty('event', 'visibility', this.state.eventData.event.visibility == 'private' ? 'public' : 'private')
        break;
      default:
        break;
    }
  }


  setStateEventDataProperty = async (parentProperty, property, value, dateValueIfDate = null) => {
    let newEventData = { ...this.state.eventData };
    let newValue = value;
    let newProperty = property;
    let newDate = new Date(dateValueIfDate);
    let currentDate = new Date(this.state.eventData.event.date);
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
          ...this.state.eventData.spot,
          spot_id: value.spot_id,
          spot_longitude: value.longitude,
          spot_latitude: value.latitude
        };
        break;
      default:
        break;
    }
    if (newProperty == 'WHOLE')
      newEventData = { ...newEventData, [parentProperty]: newValue };
    else
      newEventData = { ...newEventData, [parentProperty]: { ...newEventData[parentProperty], [newProperty]: newValue } };
    // console.log(newEvent + '.' + parentProperty + '.' + newProperty + '=' + newValue)
    return this.setState({ eventData: newEventData });
  }

  editEvent = () => {
    this.setState({ editing: true })
  }

  cancelEdit = () => {
    this.setState({ editing: false, eventData: this.getInitEventData() })
  }

}


const mapDispatchToProps = (dispatch) => {
  return {
    dispatch: (action) => { dispatch(action) }
  }
}

const mapStateToProps = (state) => ({
  ...state,
  eventDataFromStore: state.eventSaved.eventData
})

export default connect(mapStateToProps, mapDispatchToProps)(EventScreen)

