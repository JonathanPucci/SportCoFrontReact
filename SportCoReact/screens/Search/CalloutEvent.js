import * as React from 'react';
import { ScrollView, View, Image, Text, Button } from 'react-native';
import { connect } from 'react-redux'

import { Callout, CalloutSubview } from 'react-native-maps';
import { eventCalloutStyles } from './styles';
import Icon from '../../components/Icon'
import { mapSportIcon } from '../../helpers/mapper'
import SportCoApi from '../../services/apiService';
import Event from '../Event/Event';

class CalloutEvent extends React.Component {


    state = {
        event: undefined
    }

    render() {
        if (this.props.reloadCallout)
            this.getData();
        let eventInfo = this.state.event == undefined ? this.props.event : this.state.event;
        let icon = mapSportIcon(eventInfo.event.sport.toLowerCase());
        return (
            <Callout onPress={this.goToEvent.bind(this, eventInfo)} >
                <View style={eventCalloutStyles.eventContainer}>
                    <Text h5 style={eventCalloutStyles.eventTitle}>{eventInfo.event.sport.toUpperCase()}</Text>
                    <View style={eventCalloutStyles.eventDescriptionRow}>
                        <View style={eventCalloutStyles.eventDescriptionView}>
                            <View style={eventCalloutStyles.eventDescription}>
                                <Text h5 >{eventInfo.event.description}</Text>
                                <Text h5 >Participants : {eventInfo.participants.length}/{eventInfo.event.participants_max}</Text>
                                <Text h5 >{Event.computeDate(eventInfo.event.date)} 14h-16h </Text>
                            </View>
                        </View>
                        <Icon
                            name={icon.iconName}
                            type={icon.iconFamily}
                            size={30}
                            style={eventCalloutStyles.eventIcon}
                            selected={false}
                        />
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
            event: event
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


const mapStateToProps = (state) => {
    return state
}

export default connect(mapStateToProps)(CalloutEvent)

