import * as React from 'react';
import { Text, View, Image, TouchableWithoutFeedback, RefreshControl, Button } from 'react-native';
import { Divider } from 'react-native-elements'

import { ScrollView } from 'react-native-gesture-handler';
import { connect } from 'react-redux'
import { styles, iconSize } from './styles'
import SportCoApi from '../../services/apiService';
import CustomIcon from '../../components/Icon';
import Emoji from 'react-native-emoji';
import { mapSportIcon } from '../../helpers/mapper';


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
      this.setState({
        loading: false,
        refreshing: false,
        eventsInNotifications: this.state.eventsInNotificationsSoFar,
        notificationHistory: notifData
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

                  <View style={{ marginLeft: 10, }}>
                    {this.renderIcon(item)}
                  </View>
                  <View style={styles.notifDescription}>
                    {this.renderDescriptionText(item, event)}
                  </View>
                  {this.renderEventInfo(event, isCanceled)}

                  <View style={styles.notifDate}>
                    <Text style={styles.notifDateText}>{this.timeSince(new Date(item.date))}</Text>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            )
          })
        }
      </ScrollView>
    );
  }

  renderIcon(notif, size = undefined) {
    switch (notif.message_type) {
      case 'EVENT_CHANGED':
        return (
          <CustomIcon
            type='Entypo'
            name='new-message'
            size={size == undefined ? iconSize : size}
          />
        )
      case 'NEW_EVENT':
        return (
          <CustomIcon
            type='Entypo'
            name='new'
            size={size == undefined ? iconSize : size}
          />
        )
      case 'EVENT_CANCELED':
        return (
          <CustomIcon
            type='Entypo'
            name='circle-with-cross'
            size={size == undefined ? iconSize : size}
          />
        )
      default:
        break;
    }
  }

  renderDescriptionText(notif, event) {
    let messageBody = '';
    let emojiName = '';
    let additionalInfo = '';

    switch (notif.message_type) {
      case 'EVENT_CHANGED':
        messageBody = ` Event has changed, check it out !`;
        emojiName = 'man-raising-hand';
        break
      case 'NEW_EVENT':
        messageBody = '  New event nearby, interested?';
        emojiName = 'man-bowing';
        break
      case 'EVENT_CANCELED':
        let eventData = JSON.parse(notif.data_value);
        let dateString = (new Date(eventData.date).toLocaleDateString()); 
        // let sport = eventData.sport.charAt(0).toUpperCase() + eventData.sport.slice(1)
        messageBody = `  Event has been canceled, sorry !`;
        additionalInfo =  dateString + ' : ' + eventData.description + `\n`+  eventData.sport.toUpperCase() ;
        emojiName = 'man-shrugging';
        break
      default:
        break;
    }
    return (
      <View style={{ flexDirection: 'column' }}>
        <View style={styles.descriptionText}>
          <Emoji name={emojiName} style={{ fontSize: 15 }} />
          <Text numberOfLines={1} style={{ flex: 1 }}>{messageBody}</Text>
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
          {this.renderIcon({ message_type: 'EVENT_CANCELED' }, iconSize / 2)}
          <Text style={{ fontSize: 10, textAlign: 'center', justifyContent: 'center' }}>
            {`Event has been \ncanceled\nor does not\nexist anymore`}
          </Text>
        </View>
      )

    let iconSport = mapSportIcon(event.event.sport);
    let photoUrl = event.host.photo_url;

    return (
      <View style={styles.eventInfo}>
        <View style={styles.imageContainer}>
          {photoUrl != undefined ? (
            <Image source={{ uri: photoUrl + '?type=large&width=500&height=500' }} style={styles.image} />
          ) : (
              <Image source={require('../../assets/images/robot-dev.png')} style={styles.image} />
            )}
        </View>
        <CustomIcon
          name={iconSport.iconName}
          type={iconSport.iconFamily}
          size={30}
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

  goToEvent(event) {
    if (event != null)
      this.props.navigation.navigate('Event', {
        event: event
      });
  }




  timeSince(date) {
    let minute = 60;
    let hour = minute * 60;
    let day = hour * 24;
    let month = day * 30;
    let year = day * 365;

    let suffix = ' ago';

    let elapsed = Math.floor((Date.now() - date) / 1000);

    if (elapsed < minute) {
      return 'just now';
    }

    // get an array in the form of [number, string]
    let a = elapsed < hour && [Math.floor(elapsed / minute), 'minute'] ||
      elapsed < day && [Math.floor(elapsed / hour), 'hour'] ||
      elapsed < month && [Math.floor(elapsed / day), 'day'] ||
      elapsed < year && [Math.floor(elapsed / month), 'month'] ||
      [Math.floor(elapsed / year), 'year'];

    // pluralise and append suffix
    return a[0] + ' ' + a[1] + (a[0] === 1 ? '' : 's') + suffix;
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

