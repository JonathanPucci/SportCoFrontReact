import * as React from 'react';
import { ScrollView, Text, View, Image } from 'react-native';
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

        this.setState({ event: this.props.route.params.event})
      
  }

  render() {
    let event = this.state.event;
    if (event == undefined || event === {}) {
      return <View />
    }

    let eventIcon = mapSportIcon(event.event.sport.toLowerCase());
    let date = this.computeDate(event.event.date);
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>


        <View style={{ flex: 1, alignSelf: 'center' }}>
          <View style={styles.descriptionView}>

            <View style={{ flexDirection: 'column', flex: 1 }}>
              <View style={{ flex: 1, flexDirection: 'row' }}>
                <Icon
                  name={eventIcon.iconName}
                  type={eventIcon.iconFamily}
                  size={30}
                  style={{ alignSelf: 'flex-start', flex: 1 }}
                  selected={true}
                />
                <Text style={{ fontSize: 20, margin: 15, flex: 1 }}>{event.event.sport.toUpperCase()}</Text>
              </View>
              {this.renderDescriptionText('Description', event.event.description)}
              {this.renderDescriptionText('Date', date)}
              {this.renderDescriptionText('Hôte', event.host.user_name)}
            </View>
            <Image
              source={eventIcon.image}
              style={styles.imageSport}
            />
          </View>
          <View style={{ marginTop: 20, marginBottom: 20, flex: 1 }}>
            <Text>Vous trouverez ici toutes les informations concernant l'évènement ! L'adresse se trouve via le plan, ou en cliquant sur ce lien : LinkToMap</Text>
          </View>
          {this.renderMapView(event)}
          {this.renderDescriptionText('Participants', event.event.participants_min + ' / ' + event.participants.length + ' / ' +  event.event.participants_max)}

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

  computeDate(dateString){
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

