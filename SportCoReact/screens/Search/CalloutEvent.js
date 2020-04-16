import * as React from 'react';
import { ScrollView, View, Image, Text, Button, StyleSheet } from 'react-native';
import { connect } from 'react-redux'

import { Callout, CalloutSubview } from 'react-native-maps';
import { eventCalloutStyles } from './styles';
import Icon from '../../components/Icon'
import { mapSportIcon } from '../../helpers/mapper'
import SportCoApi from '../../services/apiService';
import {computeDate} from '../Event/Helpers';

class CalloutEvent extends React.Component {


    state = {
        event: undefined
    }

    render() {
        if (this.props.reloadCallout)
            this.getData();
        let eventInfo = this.state.event == undefined ? this.props.event : this.state.event;
        let photoUrl = eventInfo.host.photo_url;

        let icon = mapSportIcon(eventInfo.event.sport.toLowerCase());
        return (
            <Callout onPress={this.goToEvent.bind(this, eventInfo)} >
                <View style={eventCalloutStyles.eventContainer}>
                    <View style={{ flexDirection: 'row' }}>
                        <Icon
                            name={icon.iconName}
                            type={icon.iconFamily}
                            size={30}
                            style={eventCalloutStyles.eventIcon}
                            selected={false}
                        />
                        <Text h5 style={eventCalloutStyles.eventTitle}>{eventInfo.event.sport.toUpperCase()}</Text>
                    </View>
                    <View style={eventCalloutStyles.eventDescriptionRow}>
                        <View style={eventCalloutStyles.eventDescriptionView}>
                            <View style={eventCalloutStyles.eventDescription}>
                                <Text h5 >Participants : {eventInfo.participants.length}/{eventInfo.event.participants_max}</Text>
                                <Text h5 >{computeDate(eventInfo.event.date)} 14h-16h </Text>
                            </View>
                        </View>
                        <View style={{ alignItems: 'center', justifyContent:'center' }}>
                            <Text style={{textAlign:'center'}}>{eventInfo.host.user_name}</Text>
                            <View style={styles.imageContainer}>
                                {photoUrl != undefined ? (
                                    <Image source={{ uri: photoUrl + '?type=large&width=500&height=500' }} style={styles.image} />
                                ) :
                                    (<Image source={require('../../assets/images/robot-dev.png')} style={styles.image} />
                                    )}
                            </View>
                        </View>
                    </View>
                    <Text style={eventCalloutStyles.buttonStyle} >
                        Voir plus...
                    </Text>
                </View>
            </Callout>
        )
    }

    goToEvent(event) {
        this.props.navigation.navigate('Event', {
            eventData: event
        });
    }

    getData() {
        let event = this.props.event;
        let apiService = new SportCoApi();
        apiService.getSingleEntity("events", event.event.event_id)
            .then((eventData) => {
                this.setState({
                    event: eventData.data,
                });
                this.props.doneReloadingCallout();
            });
    }

}

const styles = StyleSheet.create({

    image: {
        alignSelf: 'center',
        height: 75,
        width: 75,
        borderWidth: 1,
        borderRadius: 37,

    },
    imageContainer: {
        alignSelf: 'flex-start',
        marginLeft: 30
    }

});


const mapStateToProps = (state) => {
    return state
}

export default connect(mapStateToProps)(CalloutEvent)

