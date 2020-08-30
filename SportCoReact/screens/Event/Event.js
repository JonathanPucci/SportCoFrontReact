import * as React from 'react';
import { Text, View, Image, RefreshControl, Platform, Linking, ScrollView } from 'react-native';
import { connect } from 'react-redux'
import { styles } from './styles'
import SportCoApi from '../../services/apiService';
import { mapSportIcon } from '../../helpers/mapper';
import { Button, Icon, Overlay, Divider } from 'react-native-elements'
import { OverlayDateTimePicker, OverlayMinMaxParticipants, OverlayDescription, OverlayLevel, OverlaySport, OverlayShareWithin } from './OverlaysEventEdition'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { LEVELS } from '../../constants/DbConstants.js'
import { createOpenLink } from 'react-native-open-maps';
import { seeProfile, isEmpty, computeDate, logDebugInfo, logDebugError } from './Helpers'
import * as EventApi from './EventApi';
import { Comments } from "./Comments/Comments";
import { DescriptionText } from "./DescriptionText/DescriptionText";
import { EventMapView } from './EventMapView/EventMapView';
import { Participants } from './Participants/Participants';
import { Options } from './Options/Options';
import { OptionIcon } from './OptionIcon';
import Geolocation from 'react-native-geolocation-service';
import { APP_URL, DEFAULT_PROFILE_PIC } from '../../constants/AppConstants'
import Share from 'react-native-share';
import AdMobInterstitial from '../../services/AdMob/AdMobInterstitial';
import AdMobBanner from '../../services/AdMob/AdMobBanner';
import { translate } from '../../App';
import FormCarousel from './FormCarousel/FormCarousel';
import { Layout } from '../../constants/Layout';
import { OverlayTimaka } from '../../components/OverLayTimaka';

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
    is_team_event : false,
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
      isEditingTime: false,
      isEditingParticipantNumbers: false,
      isEditingDescription: false,
      isEditingMapMarker: false,
      isEditingLevel: false,
      creationFlowOnGoing: false,
      currentFormStep: 0,
      regionPicked: {},
      initialRegion: {},
      sharingWithin: false,
      currentUserFriends: [],
      currentUserTeams: []
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
    this.saveNewSpotAndRetry = EventApi.saveNewSpotAndRetry.bind(this);
    this.tryToGetSpotOrSaveNew = EventApi.tryToGetSpotOrSaveNew.bind(this);
  }

  componentDidMount() {
    this.watchId = Geolocation.getCurrentPosition(
      this.setCurrentPosition,
      this.setDefaultPosition,
      {
        enableHighAccuracy: true,
        timeout: 2000,
        maximumAge: 2000
      }
    );
  }

  setDefaultPosition = (err) => {
    // console.log(Platform.OS + " error going initial hardcoded")
    logDebugError("ERROR SETTING POSITION IN EVENT", err);
    this.setCurrentPosition({ coords: { latitude: 43.6, longitude: 7.1 } });
  }

  getInitEventData = () => {
    return { ...this.props.eventDataFromStore };
  }

  setInitEventData = () => {
    const initEventData = this.getInitEventData();
    this.setState({ eventData: initEventData });
  }

  setCurrentPosition = async (position) => {
    // Geolocation.clearWatch(this.watchId);
    let region = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      latitudeDelta: 0.08,
      longitudeDelta: 0.08
    };
    await this.getData();
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

  stopCreationFlow = () => {
    console.log('stop')
    this.setState({ creationFlowOnGoing: false })
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
    let randomForAd = Math.round(Math.random() * 10);
    let displayAd = randomForAd == 2;
    console.log('renderEvent')
    return (
      <View
        style={styles.container}
      >
        {this.state.creationFlowOnGoing && (
          <OverlayTimaka>
            <FormCarousel
              eventData={this.state.eventData}
              editing={this.state.editing}
              regionPicked={this.state.regionPicked}
              isEditingMapMarker={true}
              setEditingProperty={this.setEditingProperty}
              setStateEventDataProperty={this.setStateEventDataProperty}
              regionChanged={(region) => {
                this.setState({
                  regionPicked: region,
                  eventData: {
                    ...this.state.eventData,
                    spot: { ...this.state.eventData.spot, spot_latitude: region.latitude, spot_longitude: region.longitude }
                  }
                })
              }}
              sport={this.state.eventData.event.sport}
              onSportChange={(sport) => this.setStateEventDataProperty('event', 'sport', sport)}
              saveSport={() => { this.setEditingProperty('Sport', false); }}
              onDateChange={(d) => this.setStateEventDataProperty('event', 'fulldate', null, d)}
              exitEventCreation={() => { this.stopCreationFlow(); this.props.navigation.goBack() }}
              successCreation={() => { this.stopCreationFlow() }}
            />
          </OverlayTimaka>
        )}
        <KeyboardAwareScrollView
          extraScrollHeight={150}
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={this.state.refreshing} onRefresh={() => { this.getData().then(() => { this.setInitEventData() }) }} />
          }>

          {/* {this.state.eventData.event.event_id != "" && displayAd && <AdMobInterstitial />} */}


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
                    title={'Visibility'}
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
                  isEditingTime={this.state.isEditingTime}
                  stopEditingDate={() => this.setEditingProperty('Date', false)}
                  event={eventData}
                  onDateChange={(d) => this.setStateEventDataProperty('event', 'fulldate', null, d)}
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
            <View style={{ flexDirection: 'row', alignSelf: 'center', justifyContent: 'center' }}>
              <View style={{ flexDirection: 'row', alignSelf: 'center', justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ textAlign: 'center', fontSize: 12 }}> {translate("Social Share")} </Text>
                <OptionIcon callback={this.onShare} size={20} name="share" color={'blue'} />
              </View>
              <View style={{ flexDirection: 'row', alignSelf: 'center', justifyContent: 'center', alignItems: 'center' }}>
                <OptionIcon callback={this.onShareWithin} size={20} name="share" color={'blue'} />
                <Text style={{ textAlign: 'center', fontSize: 12 }}> {translate("To Friends or Team")}</Text>
                <OverlayShareWithin
                  sharingWithin={this.state.sharingWithin}
                  stopSharingWithin={() => { this.setState({ sharingWithin: false }) }}
                  currentUserTeams={this.state.currentUserTeams}
                  currentUserFriends={this.state.currentUserFriends}
                  notifyWithin={this.notifyWithin}
                />
              </View>
            </View>
            <EventMapView
              eventData={this.state.eventData}
              editing={this.state.editing}
              regionPicked={this.state.regionPicked}
              isEditingMapMarker={this.state.isEditingMapMarker}
              setEditingProperty={this.setEditingProperty}
              setStateEventDataProperty={this.setStateEventDataProperty}
              regionChanged={(region) => { this.setState({ regionPicked: region }) }}
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
                title={translate("Click To Open in Maps")} />
            </View>
            {/* {this.state.eventData.event.event_id != "" &&
            <View>
              <AdMobBanner style={{ left: -15, marginVertical: 10 }} />
              <Text style={{ textAlign: 'center' }}>Well.. we know ads are bad, sorry about that !</Text>
            </View>
          } */}
            <View style={{ height: 15 }} />
            <Comments
              comments={this.state.eventData.comments}
              canCommentAlready={this.state.eventData.event.event_id != ""}
              addComment={this.addComment}
              validateComment={this.validateComment}
              onCommentChangeText={this.onCommentChangeText}
              cancelComment={this.cancelComment}
              setEditingProperty={this.setEditingProperty}

            />
          </View>
          <View style={{ height: 200 }}></View>
        </KeyboardAwareScrollView >
      </View>
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
            {photoUrl == undefined && <Image source={DEFAULT_PROFILE_PIC} resizeMode='contain' style={styles.imageNoBorder} />}
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
      const initialUrl = APP_URL;
      let url = initialUrl + this.state.eventData.event.event_id;
      let title = translate('notifHaveALook');
      let message = translate('clickToSeeEvent') + url

      const options = {
        title,
        subject: title,
        message: `${message}`,
      }

      const result = await Share.open(options);
      // const result = Linking.openURL('fb-messenger://share?link=www.google.com');
      console.log(result)

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
      console.log(error);
    }
  };

  onShareWithin = async () => {
    let currentUser = await this.apiService.getSingleEntity('users/email', this.props.auth.user.email);
    this.setState({
      sharingWithin: true,
      currentUserTeams: currentUser.data.userTeams,
      currentUserFriends: currentUser.data.userFriends,
    })
  }

  notifyWithin = async (type, data, index) => {
    let dataToUpdate = type == 'FRIEND' ? this.state.currentUserFriends : this.state.currentUserTeams;
    let notif = {
      sender_id: this.props.auth.user_id,
      user_id: type == 'FRIEND' ? data.user_id : this.props.auth.user_id,
      user_push_token: type == 'FRIEND' ? data.user_push_token : null,
      team_id: type == 'FRIEND' ? null : data.team_id,
      notif_message_type: 'INVIT_EVENT',
      notif_data_type: 'event_id',
      notif_data_value: this.state.eventData.event.event_id,
      sender_photo_url: this.props.auth.user.photo_url
    }
    try {
      await this.apiService.addEntity('notify/' + (type == 'FRIEND' ? 'user' : 'team'), notif);
      dataToUpdate[index]['succesfully_sent'] = true;
      type == 'FRIEND' ? this.setState({ currentUserFriends: dataToUpdate }) : this.setState({ currentUserTeams: dataToUpdate });
    }
    catch (err) {
      logDebugError('ERROR NOTIFYING WITHIN', err)
    }

  }


  /*********************************************************************************
   ********************      DATA  **  STUFF    ************************************
   ********************************************************************************/

  getData = async () => {
    let eventData = !isEmpty(this.props.route.params.eventData) ? this.props.route.params.eventData : this.state.eventData;
    if (this.state.eventData != undefined)
      eventData = this.state.eventData;
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
          editing: true,
          creationFlowOnGoing: true
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
        this.setState({ isEditingTime: isEditing })
        break;
      case 'Time':
        this.setState({ isEditingTime: isEditing })
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
      case 'Location':
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
    switch (property) {
      case 'fulldate':
        newValue = newDate;
        newProperty = 'date';

        break;
      case 'WHOLE':
        //Only for map picking location so far
        this.setEditingProperty('Location', false);
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

