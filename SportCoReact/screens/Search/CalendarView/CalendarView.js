import * as React from 'react';
import { ScrollView, View, Text, } from 'react-native';
import { connect } from 'react-redux'

import { Icon } from 'react-native-elements'
import { mapSportIcon } from '../../../helpers/mapper'
import CardEvent from '../../../components/CardEvent'
import SportCoApi from '../../../services/apiService';
import { computeDate } from '../../Event/Helpers';
import CalendarCarousel from './CalendarCarousel';

class CalendarView extends React.Component {

    constructor(props) {
        super(props);
        this.apiService = new SportCoApi();
    }

    render() {
        return (
            <View style={{ flex: 1, flexDirection: 'column' }}>
                {this.renderGallery()}
            </View>

        )
    }



    goToEvent(event) {
        this.props.navigation.navigate('Event', {
            eventData: event
        });
    }

    renderGallery = () => {
        if (this.props.events.length == 0)
            return (
                <View style={{ marginLeft: 30, padding: 5, flexDirection: 'row' }}>
                    <Text> No event so far, create one !</Text>
                </View>
            )
        let events = this.props.sortDate ? this.sortByDay(this.props.events) : this.sortBySport(this.props.events);

        return (
            <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                {events.map((dayOrSport, index) => {
                    sportOrDate = this.props.sortDate ? computeDate(dayOrSport.date, true) : dayOrSport.sport;
                    return (
                        <View style={{ flexDirection: 'column', backgroundColor: 'white', marginTop: 20, flex: 1 }} key={index}>
                            <View style={{ marginLeft: 10, padding: 5, flexDirection: 'row' }}>
                                {this.props.sortDate ?
                                    <Icon name='calendar' color='#2089dc' type='font-awesome' size={20} />
                                    :
                                    <Icon
                                        name={mapSportIcon(sportOrDate).iconName}
                                        type={mapSportIcon(sportOrDate).iconFamily}
                                        size={20}
                                        color='#2089dc'
                                    />
                                }
                                <Text style={{ fontSize: 20, marginLeft: 5, marginBottom: 7 }}>{sportOrDate.charAt(0).toUpperCase() + sportOrDate.substr(1)}</Text>
                            </View>
                            <CalendarCarousel items={dayOrSport.events} />

                        </View>
                    )
                }
                )}
            </ScrollView>
        )
    }

    sortByDay = (events) => {
        let eventsByDay = [];
        if (events.length > 0) {
            let eventsSortedByDate = events;
            eventsSortedByDate.sort((a, b) => {
                if (a.event.date < b.event.date)
                    return -1;
                return 1;
            })

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
        }
        return eventsByDay;
    }

    sortBySport = (events) => {
        let eventsBySport = [];
        if (events.length > 0) {
            let eventsSortedBySport = events;
            eventsSortedBySport.sort((a, b) => {
                if (a.event.sport < b.event.sport)
                    return -1;
                return 1;
            })
            let sport = eventsSortedBySport[0].event.sport;
            let currentSport = { sport: sport, events: [] };

            for (event of eventsSortedBySport) {
                if (event.event.sport == currentSport.sport)
                    currentSport.events.push(event);
                else {
                    eventsBySport.push(currentSport);
                    sport = (event.event.sport);
                    currentSport = { sport: sport, events: [event] };
                }
            }
            eventsBySport.push(currentSport);
        }
        return eventsBySport;
    }

}


const mapStateToProps = (state) => {
    return state
}

export default connect(mapStateToProps)(CalendarView);

