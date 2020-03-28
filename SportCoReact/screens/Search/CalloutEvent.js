import * as React from 'react';
import { ScrollView, View, Image, Text } from 'react-native';
import { connect } from 'react-redux'

import { Callout, CalloutSubview } from 'react-native-maps';
import { eventCalloutStyles } from './styles';
import Icon from '../../components/Icon'
import { mapSportIcon } from '../../helpers/mapper'

class CalloutEvent extends React.Component {

    render() {
        let eventInfo = this.props.event;
        let icon = mapSportIcon(eventInfo.event.sport.toLowerCase());
        return (
            <Callout onPress={this.goToEvent.bind(this, this.props.event)}>
                <View style={eventCalloutStyles.eventContainer}>
                    <Text h5 style={eventCalloutStyles.eventTitle}>{eventInfo.event.sport.toUpperCase()}</Text>
                    <View style={eventCalloutStyles.eventDescriptionRow}>
                        <View style={eventCalloutStyles.eventDescriptionView}>
                            <View style={eventCalloutStyles.eventDescription}>
                                <Text h5 >{eventInfo.event.description}</Text>
                                <Text h5 >Participants : 2/4</Text>
                                <Text h5 >Mercredi 25 Mars 14h-16h </Text>
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
                    <Text
                        style={eventCalloutStyles.buttonStyle}
                    >
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

}


const mapStateToProps = (state) => {
    return state
}

export default connect(mapStateToProps)(CalloutEvent)

