import * as React from 'react';
import { Text, View, Image, TouchableWithoutFeedback, RefreshControl, Button } from 'react-native';
import { Divider, Icon } from 'react-native-elements'

import { ScrollView } from 'react-native-gesture-handler';
import { connect } from 'react-redux'
import { styles, iconSize } from './styles'
import SportCoApi from '../../services/apiService';
import Emoji from 'react-native-emoji';
import { mapSportIcon, mapNotifInfo } from '../../helpers/mapper';
import { formatDistanceToNow } from 'date-fns'
import { DEFAULT_PROFILE_PIC } from '../../constants/AppConstants';
import { navigateToEvent, navigateToTeam } from '../../navigation/RootNavigation';
import { convertUTCDateToLocalDate } from '../Event/Helpers';


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
              <TouchableWithoutFeedback onPress={() => {
                item.data_type == 'team_id' ?
                  navigateToTeam(item.data_value) :
                  this.goToEvent(event, isCanceled)
              }}
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
                    <Text style={styles.notifDateText}>{formatDistanceToNow(convertUTCDateToLocalDate(new Date(item.date)))}</Text>
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
    let photoUrl = notif.data_value2;
    let iconName = mapNotifInfo(notif.message_type).iconName;
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
    let info = mapNotifInfo(notif.message_type)
    return (
      <View style={{ flexDirection: 'column' }}>
        <View style={styles.descriptionText}>
          <Emoji name={info.emojiName} style={{ fontSize: 15, marginTop: 15 }} />
          <Text numberOfLines={2} style={{ flex: 1, marginTop: 15 }}>{info.messageBody}</Text>
        </View>
        {info.additionalInfo != '' &&
          <Text numberOfLines={2} style={{ fontSize: 11 }}>{info.additionalInfo}</Text>
        }
      </View>

    )
  }

  renderEventInfo(event, isCanceled) {
    if (event == null)
      return <View />
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
    if (notif.message_type == 'EVENT_CANCELED' || notif.message_type.includes('TEAM'))
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

