import * as React from 'react';
import { ScrollView, Text, View, Image, Button } from 'react-native';
import { connect } from 'react-redux'
import { styles } from './styles'
import SportCoApi from '../../services/apiService';
import MapView from 'react-native-maps';
import { mapSportIcon } from '../../helpers/mapper';
import Icon from '../../components/Icon';

const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

class EventScreen extends React.Component {

  constructor() {
    super();
    this.state = {
    }
    this.apiService = new SportCoApi();

  }

  componentDidMount() {
    this.getData();
  }

  render() {
    let event = this.state.event;
    if (event == undefined || event === {}) {
      return <View />
    }
    let photoUrl = this.state.event.host.photoURL;
    let eventIcon = mapSportIcon(event.event.sport.toLowerCase());
    let date = EventScreen.computeDate(event.event.date);
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <View style={styles.imageContainer}>
            {photoUrl != undefined && <Image source={{ uri: photoUrl + '?type=large&width=500&height=500' }} style={styles.image} />}
            {photoUrl == undefined && <Image source={require('../../assets/images/robot-dev.png')} style={styles.image} />}
          </View>

          <View style={{ flex: 1, justifyContent: 'center', marginLeft: 15, flexDirection: 'row' }}>
            <Text style={{ fontSize: 18, flex: 3 }}>Salut ! Moi c'est {event.host.user_name}, on va faire un {event.event.sport}, n'hésite pas à nous rejoindre !</Text>
            <View style={{ flex: 1, flexDirection: 'row', marginLeft: 20 }}>
              <Icon
                name={eventIcon.iconName}
                type={eventIcon.iconFamily}
                size={30}
                style={{ alignSelf: 'center', flex: 1 }}
                selected={true}
              />
            </View>
          </View>

        </View>

        <View style={{ flex: 1, alignSelf: 'center', marginTop: 20 }}>
          <View style={styles.descriptionView}>
            <Image
              source={eventIcon.image}
              style={styles.imageSport}
            />
            <View style={{ flexDirection: 'column', flex: 1, marginLeft: 10 }}>
              {this.renderDescriptionText('Description', event.event.description)}
              {this.renderDescriptionText('Date', date)}
              {this.renderDescriptionText('Hôte', event.host.user_name)}
            </View>

          </View>
          <View style={{ marginTop: 20, marginBottom: 20, flex: 1 }}>
            <Text>Vous trouverez ici toutes les informations concernant l'évènement ! L'adresse se trouve via le plan, ou en cliquant sur ce lien : LinkToMap</Text>
          </View>
          {this.renderMapView(event)}
          <View style={{ flex: 1, flexDirection: 'row', marginLeft: 20 }}>
            {this.renderDescriptionText('Participants', event.event.participants_min + ' / ' + event.participants.length + ' / ' + event.event.participants_max)}
            <View style={{ top: 20, width: 200, backgroundColor: this.state.alreadyJoined ? "#6cab6f" : "#EEE", borderRadius: 10 }} >
              {!this.state.alreadyJoined ?
                <Button title={"Rejoindre l'évènement !"} onPress={this.joinEvent.bind(this)} />
                :
                <Button color="white" title={`Déjà rejoint ! \nAnnuler?`} onPress={this.leaveEvent.bind(this)} />
              }
            </View>
          </View>
        </View>

      </ScrollView>
    );
  }

  renderDescriptionText(title, data) {
    return (
      <View style={{ flex: 1, flexDirection: 'column' }}>
        <Text style={styles.titleDescription}>{title}</Text>
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
      <MapView
        style={styles.mapStyle}
        pitchEnabled={false}
        rotateEnabled={false}
        zoomEnabled={true}
        scrollEnabled={false}
        initialRegion={eventRegion}
        provider={"google"}
        customMapStyle={[
          {
            "featureType": "road",
            "elementType": "labels",
            "stylers": [
              {
                "visibility": "on"
              }
            ]
          }
        ]}>
        <MapView.Marker
          coordinate={eventRegion}
          onPress={() => { }}
        >
        </MapView.Marker>
      </MapView>
    )
  }

  getData() {
    let event = this.props.route.params.event;
    this.apiService.getSingleEntity("events", event.event.event_id)
      .then((eventData) => {
        this.apiService.getSingleEntity("users/email", this.props.auth.user.email)
          .then((data) => {
            this.setState({
              event: eventData.data,
              user_id: data.data.user_id,
              alreadyJoined: this.computeAlreadyJoined(data.data.user_id, eventData.data.participants)
            });
          });
      });
  }

  joinEvent() {
    let eventP = {
      user_id: this.state.user_id,
      event_id: this.state.event.event.event_id
    }
    this.apiService.addEntity('eventparticipant', eventP)
      .then((data) => {
        this.getData();
      })
  }

  leaveEvent() {
    let eventP = {
      user_id: this.state.user_id,
      event_id: this.state.event.event.event_id
    }
    this.apiService.deleteEntity('eventparticipant', eventP)
      .then((data) => {
        this.getData();
      })
  }

  computeAlreadyJoined(userId, participants) {
    for (let index = 0; index < participants.length; index++) {
      const participant = participants[index];
      if (participant.user_id == userId)
        return true;
    }
    return false;
  }

  static computeDate(dateString) {
    let date = (new Date(dateString)).toLocaleDateString(undefined, dateOptions);
    return date.charAt(0).toUpperCase() + date.slice(1);
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

