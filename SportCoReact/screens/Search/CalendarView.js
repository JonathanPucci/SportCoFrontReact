import * as React from 'react';
import { ScrollView, View, Image, Text, TouchableWithoutFeedback } from 'react-native';
import { connect } from 'react-redux'
import { useFocusEffect } from '@react-navigation/native';

import { Callout, CalloutSubview } from 'react-native-maps';
import { eventCalloutStyles, markerStyles, CARD_WIDTH } from './styles';
import { Icon } from 'react-native-elements'
import { mapSportIcon } from '../../helpers/mapper'
import CardEvent from '../../components/CardEvent'
import SportCoApi from '../../services/apiService';
import { translate } from '../../App';
import { convertUTCDateToLocalDate, computeDate } from '../Event/Helpers';

const GALLERY_LINE_SIZE = 2

class CalendarView extends React.Component {

    render() {
        return (
            <View style={{ flex: 1, flexDirection: 'column' }}>
                <EventGalleryScreen events={this.props.events} navigation={this.props.navigation} />
            </View>
        )
    }

}


export class EventGalleryScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            events: props.events,
            eventsActive: props.events,
        };
        this.apiService = new SportCoApi();
    }

    render() {
        return (
            <ScrollView style={{ flex: 1, flexDirection: 'column' }} showsVerticalScrollIndicator={false}>
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
        let eventsSortedByDate = this.sortByDay(this.state.events);

        return (
            <View style={{ flexDirection: 'column' }}>
                {eventsSortedByDate.map((day, index) => {
                    var pairs = this.getPairsArray(day.events);
                    let stringDate = computeDate(day.date, true);
                    stringDate = stringDate.charAt(0).toUpperCase() + stringDate.substr(1);
                    return (
                        <View style={{ flexDirection: 'column' }} key={index}>
                            <View style={{ marginLeft: 30, padding: 5, flexDirection: 'row' }}>
                                <Icon name='calendar' color='#2089dc' type='font-awesome' size={20}  />
                                <Text style={{ fontSize: 20, marginLeft : 5 }}>{stringDate}</Text>
                            </View>
                            {pairs.map((item, index) => {
                                return (
                                    <View key={index}>

                                        <View style={markerStyles.item}>
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
                                        </View>
                                    </View>
                                )
                            }
                            )}
                        </View>
                    )
                }
                )}
            </View>


        )
    }

    sortByDay(events) {
        let eventsSortedByDate = events;
        eventsSortedByDate.sort((a, b) => {
            if (a.event.date < b.event.date)
                return -1;
            return 1;
        })

        let eventsByDay = [];
        let day = (new Date(eventsSortedByDate[0].event.date));
        let currentDay = { date: day, events: [] };

        for (event of eventsSortedByDate) {
            if ((new Date(event.event.date)).getDate() == (new Date(currentDay.date)).getDate())
                currentDay.events.push(event);
            else {
                eventsByDay.push(currentDay);
                day = (new Date(event.event.date));
                currentDay = { date: day, events: [event] };
            }
        }
        eventsByDay.push(currentDay);
        return eventsByDay;
    }



    getPairsArray(events) {
        var pairs_r = [];
        var pairs = [];
        var count = 0;
        events.forEach((item, index, array) => {
            count += 1;
            pairs.push(item);
            if (count == GALLERY_LINE_SIZE) {
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

export default connect(mapStateToProps)(CalendarView);

