import * as React from 'react';
import { Text, View, Image, TouchableWithoutFeedback, RefreshControl, Button } from 'react-native';
import { Divider, Icon } from 'react-native-elements'

import { ScrollView } from 'react-native-gesture-handler';
import { connect } from 'react-redux'
import { styles, iconSize } from './styles'
import SportCoApi from '../../services/apiService';
import Emoji from 'react-native-emoji';
import { mapSportIcon } from '../../helpers/mapper';
import { formatDistanceToNow } from 'date-fns'
import { DEFAULT_PROFILE_PIC } from '../../constants/AppConstants';
import { navigateToEvent } from '../../navigation/RootNavigation';


class NotificationsScreen extends React.Component {

  constructor() {
    super()
    this.state = {
      refreshing: false,
      loading: true,
      notificationHistory: [],
      eventsInNotifications: [],
      eventsInNotificationsSoFar: []
    }
    this.apiService = new SportCoApi()
  }

  componentDidMount() {
    this.getData();
  }

  getData() {
    this.setState({ loading: true, refreshing: true, notificationHistory: [], eventsInNotificationsSoFar: [] },
      this.doGetData.bind(this));
  }

  doGetData() {
    this.apiService.getSingleEntity('users/notifications', this.props.auth.user_id)
      .then((notifData) => {
        if (notifData.data.length == 0)
          this.setState({ loading: false });
        else
          for (let index = 0; index < notifData.data.length; index++) {
            const notif = notifData.data[index];
            if (notif.message_type === 'EVENT_CANCELED') {
              let events = this.state.eventsInNotificationsSoFar;
              let event = { isCanceled: true, event: notif.data_value };
              events.push(event);
              this.setState({ eventsInNotificationsSoFar: events }, this.checkIfAllEventsRetrieved.bind(this, notifData.data));
            } else {
              this.apiService.getSingleEntity('events', notif.data_value)
                .then((eventData) => {
                  let event = eventData.data;
                  event.isCanceled = false;
                  let events = this.state.eventsInNotificationsSoFar;
                  events.push(event);
                  this.setState({ eventsInNotificationsSoFar: events }, this.checkIfAllEventsRetrieved.bind(this, notifData.data));
                })
                .catch((err) => {
                  let event = { isCanceled: true, event: {} };
                  let events = this.state.eventsInNotificationsSoFar;
                  events.push(event);
                  this.setState({ eventsInNotificationsSoFar: events }, this.checkIfAllEventsRetrieved.bind(this, notifData.data));
                });
            }
          }
      })
      .catch((err) => {
        this.setState({ loading: false, refreshing: false });
      });
  }

  checkIfAllEventsRetrieved(notifData) {
    if (this.state.eventsInNotificationsSoFar.length == notifData.length) {
      let sortedNotifs = notifData.sort((a, b) => { if ((new Date(a.date)) > (new Date(b.date))) return -1 });
      this.setState({
        loading: false,
        refreshing: false,
        eventsInNotifications: this.state.eventsInNotificationsSoFar,
        notificationHistory: sortedNotifs
      });
    }
  }

  render() {
    if (this.state.loading)
      return (
        <View style={{ marginTop: 100, alignSelf: 'center', justifyContent: 'center', alignItems: 'center' }}>
          <Text>Loading...</Text>
        </View>
      )
    if (this.state.notificationHistory.length == 0)
      return (
        <View style={{ marginTop: 100, alignSelf: 'center', justifyContent: 'center', alignItems: 'center' }}>
          <Text>No Notifications yet...</Text>
          <Text>Join an event or create one !</Text>
          <Button onPress={this.getData.bind(this)} title='Refresh' />
        </View>
      )
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl refreshing={this.state.refreshing} onRefresh={this.getData.bind(this)} />
        }>
        <Divider style={styles.divider} />
        {
          this.state.notificationHistory.map((item, index) => {
            let event = this.getEventFromNotif(item);
            let isCanceled = event == null;
            return (
              <TouchableWithoutFeedback onPress={this.goToEvent.bind(this, event, isCanceled)}
                key={'keyHistory-' + index}
                style={styles.notificationView}>
                <View
                  style={styles.notificationView}>

                  <View style={{ alignSelf: 'center', marginLeft: 10 }}>
                    {this.renderIcon(item, event)}
                  </View>
                  <View style={styles.notifDescription}>
                    {this.renderDescriptionText(item, event)}
                  </View>
                  {this.renderEventInfo(event, isCanceled)}

                  <View style={styles.notifDate}>
                    <Text style={styles.notifDateText}>{formatDistanceToNow(new Date(item.date))}</Text>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            )
          })
        }
      </ScrollView>
    );
  }

  renderIcon(notif, event, size = undefined) {
    let iconName = '';
    let photoUrl = notif.data_value2;
    switch (notif.message_type) {
      case 'EVENT_CHANGED':
        iconName = 'new-message';
        break;
      case 'NEW_EVENT':
        iconName = 'new'
        break;
      case 'INVIT_EVENT':
        iconName = 'new'
        break;
      case 'EVENT_CANCELED':
        iconName = 'circle-with-cross'
        break;
      case 'PARTICIPANT_JOINED':
        iconName = 'add-user';
        break;
      case 'PARTICIPANT_LEFT':
        iconName = 'remove-user';
        break;
      default:
        break;
    }


    return (
      <View style={styles.imageContainer}>
        {photoUrl != undefined ? (
          <Image source={{ uri: photoUrl + '?type=large&width=500&height=500' }} style={styles.image} />
        ) : (
            <Image source={DEFAULT_PROFILE_PIC} resizeMode='contain' style={styles.image} />
          )}


        <View style={{
          position: 'absolute',
          top: 30,
          right: 20,
          width: iconSize + 10,
          height: iconSize + 10,
          borderRadius: (iconSize + 10) / 2,
          backgroundColor: 'rgb(21,103,212)',
          justifyContent: 'center'
        }}>
          <Icon
            type='entypo'
            name={iconName}
            color={'white'}
            size={size == undefined ? iconSize : size}
          />
        </View>
      </View>
    )
  }

  renderDescriptionText(notif) {
    let messageBody = '';
    let emojiName = '';
    let additionalInfo = '';
    switch (notif.message_type) {
      case 'EVENT_CHANGED':
        messageBody = ` Event has changed, check it out !`;
        emojiName = 'man-raising-hand';
        break;
      case 'NEW_EVENT':
        messageBody = '  New event nearby, interested?';
        emojiName = 'man-bowing';
        break;
      case 'INVIT_EVENT':
        messageBody = '  shared an event with you, check it out !';
        emojiName = 'man-bowing';
        break;
      case 'EVENT_CANCELED':
        let eventData = JSON.parse(notif.data_value);
        messageBody = `  Event has been canceled, sorry !`;
        // additionalInfo = dateString + ' : ' + eventData.description + `\n` + eventData.sport.toUpperCase();
        emojiName = 'man-shrugging';
        break;
      case 'PARTICIPANT_JOINED':
        messageBody = '  New participant to your event';
        emojiName = 'man-running';
        break;
      case 'PARTICIPANT_LEFT':
        messageBody = '  Participant left your event';
        emojiName = 'man-running';
        break;
      default:
        break;
    }
    return (
      <View style={{ flexDirection: 'column' }}>
        <View style={styles.descriptionText}>
          <Emoji name={emojiName} style={{ fontSize: 15, marginTop: 15 }} />
          <Text numberOfLines={2} style={{ flex: 1, marginTop: 15 }}>{messageBody}</Text>
        </View>
        {additionalInfo != '' &&
          <Text numberOfLines={2} style={{ fontSize: 11 }}>{additionalInfo}</Text>
        }
      </View>

    )
  }

  renderEventInfo(event, isCanceled) {
    if (isCanceled)
      return (
        <View style={[styles.eventInfo, { right: 10 }]}>
          <Text style={{ fontSize: 10, textAlign: 'center', justifyContent: 'center' }}>
            {`Event has been \ncanceled\nor does not\nexist anymore`}
          </Text>
        </View>
      )

    let iconSport = mapSportIcon(event.event.sport);

    return (
      <View style={styles.eventInfo}>
        <Icon
          name={iconSport.iconName}
          type={iconSport.iconFamily}
          size={30}
          color={'rgb(21,103,212)'}
          style={{ alignSelf: 'center' }}
          selected={false}
        />
      </View>
    )
  }

  getEventFromNotif(notif) {
    if (notif.message_type == 'EVENT_CANCELED')
      return null;
    for (let index = 0; index < this.state.eventsInNotifications.length; index++) {
      const event = this.state.eventsInNotifications[index];
      if (!event.isCanceled && event.event.event_id == notif.data_value)
        return event;
    }
    return null;
  }

  goToEvent(event, isCanceled) {
    if (event != null && !isCanceled)
      navigateToEvent(event.event.event_id)
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

export default connect(mapStateToProps, mapDispatchToProps)(NotificationsScreen)

