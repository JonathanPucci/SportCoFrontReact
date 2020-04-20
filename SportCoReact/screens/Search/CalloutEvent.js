import * as React from 'react';
import { ScrollView, View, Image, Text, Button, StyleSheet } from 'react-native';
import { connect } from 'react-redux'

import { Callout, CalloutSubview } from 'react-native-maps';
import { eventCalloutStyles } from './styles';
import { Icon } from 'react-native-elements';
import { mapSportIcon } from '../../helpers/mapper'
import SportCoApi from '../../services/apiService';
import { computeDate } from '../Event/Helpers';
import Colors from '../../constants/Colors';

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
            <Callout onPress={() => this.goToEvent(eventInfo)} >
                <View style={eventCalloutStyles.eventContainer}>
                    <View style={{ flexDirection: 'row' }}>
                        <Icon
                            name={icon.iconName}
                            type={icon.iconFamily}
                            size={30}
                            style={eventCalloutStyles.eventIcon}
                            color={Colors.tabIconDefault}
                        />
                        <Text h5 style={eventCalloutStyles.eventTitle}>{eventInfo.event.sport.toUpperCase()}</Text>
                    </View>
                    <View style={eventCalloutStyles.eventDescriptionRow}>
                        <View style={eventCalloutStyles.eventDescriptionView}>
                            <View style={eventCalloutStyles.eventDescription}>
                                <Text h5 >Participants : {eventInfo.participants.length}/{eventInfo.event.participants_max}</Text>
                                <Text h5 >{computeDate(eventInfo.event.date)}</Text>
                            </View>
                        </View>
                        <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 10 }}>
                            <Text style={{ textAlign: 'center', marginBottom:10 }}>{eventInfo.host.user_name}</Text>
                            <View style={styles.imageContainer}>
                                {eventInfo.host.photo_url != undefined ?
                                    <Text  >
                                        <Image source={{ uri: eventInfo.host.photo_url + '?type=large&width=500&height=500' }} style={styles.image} resizeMode="cover" />
                                    </Text>
                                    :
                                    <Text  >
                                        <Image source={require('../../assets/images/robot-dev.png')} style={styles.image} resizeMode="cover" />
                                    </Text>
                                }
                            </View>
                        </View>
                    </View>
                    <Icon
                        style={eventCalloutStyles.buttonStyle}
                        reverse
                        color='blue'
                        size={15}
                        name='more-horiz'
                    />
                </View>
            </Callout>
        )
    }

    goToEvent = (event) => {
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
        height: 60,
        width: 60,
        borderWidth: 1,
        borderRadius: 30,

    },
    imageContainer: {
        alignSelf: 'center',
        // marginLeft: 30
    }

});


const mapStateToProps = (state) => {
    return state
}

export default connect(mapStateToProps)(CalloutEvent)

