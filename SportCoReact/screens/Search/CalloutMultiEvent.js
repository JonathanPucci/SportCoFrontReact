import * as React from 'react';
import { ScrollView, View, Image, Text, TouchableWithoutFeedback } from 'react-native';
import { connect } from 'react-redux'
import { useFocusEffect } from '@react-navigation/native';

import { Callout, CalloutSubview } from 'react-native-maps';
import { eventCalloutStyles, markerStyles, CARD_WIDTH } from './styles';
import { Icon } from 'react-native-elements'
import { mapSportIcon } from '../../helpers/mapper'
import CardEvent from '../../components/CardEvent'
import Colors from '../../constants/Colors';
import SportCoApi from '../../services/apiService';
import { translate } from '../../App';

class CalloutMultiEvent extends React.Component {

    render() {
        // if (this.props.reloadCallout)
        //     this.getData();
        // let eventInfo = this.state.event == undefined ? this.props.event : this.state.event;
        return (

            <Callout onPress={() => this.goToEventLibrary(this.props.events)} >
                <View style={eventCalloutStyles.eventContainer}>
                    <Text h5 style={eventCalloutStyles.eventTitle}>{translate("Many events here !")}</Text>
                    {this.props.events != undefined &&
                        (<View style={eventCalloutStyles.eventSports}>
                            {this.props.events.map((item, index) => {
                                let icon = mapSportIcon(item.event.sport.toLowerCase());
                                return (
                                    <View
                                        key={'key' + index}
                                        style={eventCalloutStyles.eventSport}>
                                        <Icon
                                            name={icon.iconName}
                                            type={icon.iconFamily}
                                            size={30}
                                            color={Colors.tabIconDefault}
                                        />
                                    </View>
                                )
                            })
                            }
                        </View>)
                    }
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


    goToEventLibrary = (events) => {
        this.props.navigation.navigate('Evenements', {
            events: events
        });
    }

}

// Effect to get Events at focus (after coming back from events)
function FetchData({ onFocus }) {
    useFocusEffect(
        React.useCallback(() => {
            onFocus();
            return () => { };
        }, [])
    );

    return null;
}

export class MultiEventScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            events: [],
            eventsActive: [],
        };
        this.apiService = new SportCoApi();
    }

    componentDidMount() {
        this.getEventsStillActive(this.props.route.params.events);
    }

    getEventsStillActive(eventsInput) {
        let eventsToCheck = eventsInput;
        if (eventsInput.fromFocus)
            eventsToCheck = this.state.events;
        this.setState({ events: [], eventsCancelled: [] }, () => {
            for (let index = 0; index < eventsToCheck.length; index++) {
                const eventData = eventsToCheck[index];
                this.apiService.getSingleEntity('events', eventData.event.event_id)
                    .then(() => {
                        let events = this.state.events;
                        events.push(eventData);
                        this.setState({ events: events });
                    })
                    .catch(()=>
                    {
                        //event has been cancelled or does not exist anymore
                    })
            }
        })
    }

    render() {
        return (
            <ScrollView style={{ flex: 1, flexDirection: 'column' }}>
                <FetchData onFocus={this.getEventsStillActive.bind(this, { fromFocus: true })} />
                {this.renderGallery()}
            </ScrollView>
        )
    }

    renderSportCard(item, index) {
        return (
            <CardEvent markerActive={true} pressedCard={this.goToEvent.bind(this, item)} item={item} />
        )
    }


    goToEvent(event) {
        this.props.navigation.navigate('Event', {
            eventData: event
        });
    }

    renderGallery() {
        var pairs = this.getPairsArray(this.state.events);
        return (
            <View style={{ flexDirection: 'column' }}>
                {pairs.map((item, index) => {
                    return (
                        <View style={markerStyles.item} key={index}>
                            <View style={markerStyles.galleryItem}>
                                {this.renderSportCard(item[0], index)}
                            </View>
                            {item[1].event_id != '-1' && (
                                <View style={markerStyles.galleryItem}>
                                    {this.renderSportCard(item[1], index)}
                                </View>
                            )}
                            {item[1].event_id == '-1' && (
                                <View style={markerStyles.emptyGalleryItem} />
                            )}
                        </View>)
                }
                )}
            </View>
        )

    }

    getPairsArray(events) {
        var pairs_r = [];
        var pairs = [];
        var count = 0;
        events.forEach((item, index, array) => {
            count += 1;
            pairs.push(item);
            if (count == 2) {
                pairs_r.push(pairs);
                count = 0;
                pairs = [];
            } else if (count == 1 && index == events.length - 1) {
                pairs_r.push([item, { event_id: '-1' }]);
            }
        });
        return pairs_r;
    }



}


const mapStateToProps = (state) => {
    return state
}

export default connect(mapStateToProps)(CalloutMultiEvent);

