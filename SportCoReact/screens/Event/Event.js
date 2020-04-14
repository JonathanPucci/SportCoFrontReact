import * as React from 'react';
import { TextInput, Text, View, Image, RefreshControl, Platform } from 'react-native';
import { connect } from 'react-redux'
import { styles } from './styles'
import SportCoApi from '../../services/apiService';
import MapView from 'react-native-maps';
import { mapSportIcon } from '../../helpers/mapper';
import CustomIcon from '../../components/Icon';
import { Button, Icon } from 'react-native-elements'
import { RenderOverlayDateTimePicker, RenderOverlayMinMaxParticipants, RenderOverlayDescription, RenderOverlayLevel, RenderMapViewSpotPicker, RenderOverlaySport } from './OverlaysEventEdition'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { LEVELS } from '../../constants/DbConstants.js'
import { createOpenLink } from 'react-native-open-maps';
import { OptionIcon } from './OptionIcon'
import { seeProfile, isOrganizedByMe, isEmpty, computeAlreadyJoined, computeDate, timeSince, mapLevelImage } from './Helpers'
import { addComment, cancelComment, onCommentChangeText, validateComment } from './EventApi';
import { joinEvent, leaveEvent } from './EventApi';
import { editEvent, cancelEdit, cancelEvent, updateEvent } from './EventApi';

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
      isEditingLevel: false,
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
          spot_id: '',
          sport_level: 'intermediate'
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
        participants: [],
        comments: []
      },
      eventBeforeEdit: {},
      regionPicked: {

      },
      initialRegion: {}
    };
    this.apiService = new SportCoApi();
    this.addComment = addComment.bind(this);
    this.validateComment = validateComment.bind(this);
    this.onCommentChangeText = onCommentChangeText.bind(this);
    this.cancelComment = cancelComment.bind(this);
    this.joinEvent = joinEvent.bind(this);
    this.leaveEvent = leaveEvent.bind(this);
    this.cancelEvent = cancelEvent.bind(this);
    this.updateEvent = updateEvent.bind(this);
    this.editEvent = editEvent.bind(this);
    this.cancelEdit = cancelEdit.bind(this);
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


  /********************************************************************************
 *************************                  ***************************************
 ********************         RENDER             **********************************
 *************************                  ***************************************
 *********************************************************************************/


  render() {
    let event = this.state.event;
    let photoUrl = this.state.event.host.photo_url;
    let eventIcon = mapSportIcon(event.event.sport.toLowerCase());
    let date = computeDate(event.event.date);
    return (
      <KeyboardAwareScrollView
        extraScrollHeight={150}
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
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
              {this.renderDescriptionText('Level', event.event.sport_level.toLocaleUpperCase())}
              <View style={{ flexDirection: 'row' }}>
                {this.renderDescriptionText('Min', event.event.participants_min, 'flex-start')}
                {this.renderDescriptionText('Going', event.participants.length, 'center', false)}
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
              <RenderOverlayLevel
                isEditingLevel={this.state.isEditingLevel}
                stopEditingLevel={() => { this.setState({ isEditingLevel: false }) }}
                level={this.state.event.event.sport_level}
                levels={LEVELS}
                onLevelChange={this.setStateProperty.bind(this, 'event', 'sport_level')}
                saveLevel={this.setEditingProperty.bind(this, 'Level', false)}
              />
            </View>
          </View>
          {this.renderParticipants()}

          {this.renderMapView(event)}
          <View style={{ marginTop: 20, marginBottom: 20, flex: 1 }}>
            <Button
              color={'#bdc3c7'}
              onPress={Platform.OS == 'ios' ?
                createOpenLink({
                  latitude: parseFloat(this.state.event.spot.spot_latitude),
                  longitude: parseFloat(this.state.event.spot.spot_longitude),
                  query: 'Oh yeah'
                }) :
                createOpenLink({
                  query: (this.state.event.spot.spot_latitude + ',' + this.state.event.spot.spot_longitude)
                })
              }
              title="Click To Open in Maps" />
          </View>
          {this.renderComments(event)}
        </View>
        <View style={{ height: 200 }}></View>
      </KeyboardAwareScrollView>
    );
  }


  /*********************************************************************************
   *************************                 ***************************************
   ********************      RENDERING HEADER   ************************************
   *************************                 ***************************************
   ********************************************************************************/


  renderHostHeader(event, photoUrl, eventIcon) {
    return (
      <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
        <TouchableWithoutFeedback onPress={seeProfile.bind(this, this.state.event.host.email)}>
          <View style={styles.imageContainer}>
            {photoUrl != undefined && <Image source={{ uri: photoUrl + '?type=large&width=500&height=500' }} style={styles.image} />}
            {photoUrl == undefined && <Image source={require('../../assets/images/robot-dev.png')} style={styles.image} />}
          </View>
        </TouchableWithoutFeedback>

        <View style={{
          justifyContent: 'center', alignItems: 'center'
        }}>
          <Text style={{ fontSize: 18 }}>{event.event.sport.toUpperCase()}</Text>
          {this.renderOptions()}
        </View>
        <View style={{ flexDirection: 'column', alignSelf: 'center', alignItems: 'center' }}>
          <CustomIcon
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
              onPress={this.setEditingProperty.bind(this, 'Sport', true)} />
          )}
        </View>
        <RenderOverlaySport
          isEditingSport={this.state.isEditingSport}
          stopEditingSport={() => { this.setState({ isEditingSport: false }) }}
          sport={this.state.event.event.sport}
          onSportChange={this.setStateProperty.bind(this, 'event', 'sport')}
          saveSport={this.setEditingProperty.bind(this, 'Sport', false)}
        />
      </View>
    )
  }


  /********************************************************************************
 *************************                  ***************************************
 ********************         DESCRIPTION        **********************************
 *************************                  ***************************************
 *********************************************************************************/

  renderDescriptionText(title, data, centered = 'auto', isMutable = true) {
    let levelImage = null;
    if (title == 'Level') {
      levelImage = mapLevelImage(this.state.event.event.sport, null, data.toLowerCase());
    }
    return (
      <View style={[
        { flex: 1, flexDirection: 'column', marginBottom: 10 },
        this.state.editing ? { bottom: 15 } : {},
      ]}>
        <View style={{ flex: 1, flexDirection: 'row' }}>
          {this.state.editing && isMutable && (
            <Icon
              raised
              name='edit'
              type='font-awesome'
              color='orange'
              size={title == 'Min' || title == 'Max' ? 4 : 15}
              onPress={this.setEditingProperty.bind(this, title, true)} />
          )}
          <Text style={[styles.titleDescription, centered != 'auto' ? { textAlign: 'center' } : {}, this.state.editing ? { top: 15 } : {}]}>{title}</Text>
        </View>
        <View style={styles.titleDescriptionText}>
          {title == 'Level' && (
            <Image source={levelImage} style={{ bottom: this.state.editing ? 40 : 30, left: this.state.editing ? 100 : 50, height: 40, width: 40 }} />
          )}
          <Text style={[styles.titleDescriptionText,
          { marginTop: title == 'Min' || title == 'Going' || title == 'Max' ? 10 : title == 'Level' ? -30 : 0 },
          centered != 'auto' ? { alignSelf: 'center' } : {}]}>
            {data}
          </Text>

        </View>
      </View>
    )
  }


  /********************************************************************************
 *************************                  ***************************************
 ********************         MAPVIEW       **********************************
 *************************                  ***************************************
 *********************************************************************************/


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


  /********************************************************************************
 *************************                  ***************************************
 ********************         OPTIONS            **********************************
 *************************                  ***************************************
 *********************************************************************************/

  renderOptions() {
    return (
      <View style={{ flex: 1, flexDirection: 'row', marginTop: 10, alignSelf: 'center' }}>
        <View style={{ borderRadius: 10 }} >
          {isOrganizedByMe(this.state.loggedUser_id, this.state.event.event.host_id) ? (
            <View>

              {this.state.editing ? (
                <View style={{ flexDirection: 'row' }} >
                  <OptionIcon name='check' color='green' callback={this.updateEvent.bind(this)} />
                  <OptionIcon name='remove' color='red' callback={this.cancelEdit.bind(this)} />
                </View>
              ) : (
                  <View style={{ flexDirection: 'row' }} >
                    <OptionIcon name='edit' callback={this.editEvent.bind(this)} />
                    <OptionIcon name='remove' color='red' callback={this.cancelEvent.bind(this)} />
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


  /********************************************************************************
 *************************                  ***************************************
 ********************         PARTICIPANTS       **********************************
 *************************                  ***************************************
 *********************************************************************************/

  renderParticipants() {
    return (
      <View style={{ marginTop: 30 }} >
        {this.renderDescriptionText('Participants', '', 'auto', false)}
        <View style={{ flexDirection: 'row' }}>
          {this.state.event.participants.map((participant, index) => {
            let photoUrl = participant.photo_url;
            let levelImage = mapLevelImage(this.state.event.event.sport, participant);
            return (
              <View key={'participant-' + index} style={{ flexDirection: 'column', marginHorizontal: 10, justifyContent: 'center', alignItems: 'center' }}>
                <TouchableWithoutFeedback onPress={seeProfile.bind(this, participant.email)}>
                  <View style={styles.imageContainerParticipant}>
                    {photoUrl != undefined && <Image source={{ uri: photoUrl + '?type=large&width=500&height=500' }} style={styles.imageParticipant} />}
                    {photoUrl == undefined && <Image source={require('../../assets/images/robot-dev.png')} style={styles.imageParticipant} />}
                  </View>
                </TouchableWithoutFeedback>
                <Text numberOfLines={1} style={{ alignSelf: 'center', marginBottom: 10, width: 50 }}>{participant.user_name}</Text>
                <Image source={levelImage} style={{ position: 'absolute', bottom: 50, left: 30, height: 40, width: 40 }} />
              </View>
            )
          })}
        </View>

      </View>
    )
  }

  /*********************************************************************************
 *************************                   ***************************************
 ********************       RENDER COMMENTS     ************************************
 *************************                   ***************************************
 **********************************************************************************/


  renderComments() {
    let comments = this.state.event.comments.slice()
      .sort((a, b) => {
        if (a == 'NEW')
          return 1;
        if (b == 'NEW')
          return -1;
        else
          return (new Date(a.date)) - (new Date(b.date));
      });

    return (
      <View style={{ marginTop: 30 }}>
        {this.renderDescriptionText('Comments', '', 'auto', false)}
        {comments.map((comment, index) => {
          let photoUrl = comment.photo_url;
          return (
            <View key={"comment-" + index} style={styles.commentBloc}>
              <View style={styles.commentInfo}>
                <View style={{ flexDirection: 'row' }}>
                  <View style={styles.imageContainerComment}>
                    {photoUrl != undefined && <Image source={{ uri: photoUrl + '?type=large&width=500&height=500' }} style={styles.imageComment} />}
                    {photoUrl == undefined && <Image source={require('../../assets/images/robot-dev.png')} style={styles.imageComment} />}
                  </View>
                  <Text style={styles.commentUserName}>{comment.user_name.split(' ')[0]} : </Text>
                </View>
                <Text style={styles.commentDate}>{timeSince(comment.isNew ? new Date() : new Date(comment.date))}</Text>
                {comment.isNew && (
                  <View style={{ flexDirection: 'row' }}>
                    <OptionIcon name='check' color='green' callback={this.validateComment.bind(this)} />
                    <OptionIcon name='remove' color='red' callback={this.cancelComment.bind(this)} />
                  </View>
                )}
              </View>
              <View style={{ width: '75%' }}>
                {comment.isNew ?
                  (<View style={{
                    borderBottomColor: '#000000',
                    borderBottomWidth: 0.5,
                    width: '75%'
                  }}>
                    <TextInput
                      multiline
                      numberOfLines={3}
                      editable
                      maxLength={300}
                      height={50}
                      onChangeText={this.onCommentChangeText.bind(this)}
                      value={comments[comments.length - 1].comment_text}
                    />
                  </View>) :
                  <Text numberOfLines={3} style={styles.commentText}>{comment.comment_text}</Text>
                }
              </View>
            </View>
          )
        })}
        {(!comments.length ||
          (comments.length && !comments[comments.length - 1].isNew)) &&
          <View style={{ flex: 1 }}>
            <OptionIcon name='plus' color='blue' callback={this.addComment} />
          </View>
        }
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
      let event = !isEmpty(this.props.route.params.event) ? this.props.route.params.event : this.state.event;
      let eventId = (event.event.event_id == "") ? -1 : event.event.event_id;
      this.apiService.getSingleEntity("events", eventId)
        .then((eventData) => {
          this.apiService.getSingleEntity("users/email", this.props.auth.user.email)
            .then((data) => {
              this.setState({
                refreshing: false,
                event: eventData.data,
                loggedUser_id: data.data.user_id,
                alreadyJoined: computeAlreadyJoined(data.data.user_id, eventData.data.participants),
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

  setEditingProperty(property, doneornot) {
    switch (property) {
      case 'Sport':
        this.setState({ isEditingSport: doneornot })
        break;
      case 'Date':
        this.setState({ isEditingDate: doneornot })
        break;
      case 'Min':
      case 'Participants':
      case 'Max':
        this.setState({ isEditingParticipantNumbers: doneornot })
        break;
      case 'Description':
        this.setState({ isEditingDescription: doneornot })
        break;
      case 'Level':
        this.setState({ isEditingLevel: doneornot })
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
    // console.log(newEvent + '.' + parentProperty + '.' + newProperty + '=' + newValue)
    this.setState({ event: newEvent });
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

