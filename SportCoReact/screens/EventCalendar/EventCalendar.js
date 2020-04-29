import * as React from 'react';
import { StyleSheet, Image, Text, View, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux'
import { styles } from './styles'
import { Agenda, LocaleConfig } from 'react-native-calendars';
import SportCoApi from '../../services/apiService';
import { mapSportIcon } from '../../helpers/mapper';
import {Icon} from 'react-native-elements'
import * as RootNavigation from '../../navigation/RootNavigation.js';

const testIDs = require('./testIDs');

LocaleConfig.locales['fr'] = {
    monthNames: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
    monthNamesShort: ['Janv.', 'Févr.', 'Mars', 'Avril', 'Mai', 'Juin', 'Juil.', 'Août', 'Sept.', 'Oct.', 'Nov.', 'Déc.'],
    dayNames: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
    dayNamesShort: ['Dim.', 'Lun.', 'Mar.', 'Mer.', 'Jeu.', 'Ven.', 'Sam.'],
    today: 'Aujourd\'hui'
};
LocaleConfig.defaultLocale = 'fr';

const vacation = { key: 'vacation', color: 'red', selectedDotColor: 'blue' };
const massage = { key: 'massage', color: 'blue', selectedDotColor: 'blue' };
const workout = { key: 'workout', color: 'green' };


class EventCalendar extends React.Component {

    constructor() {
        super();
        this.state = {
            events: {}
        }
        this.api = new SportCoApi();
    }

    getData(day) {
        this.api.getSingleEntity("eventparticipant/participantEvents", this.props.auth.user_id)
            .then(data => {
                let eventsInAgendaFormat = this.computeEvents(data.data, day);
                this.setState({ events: eventsInAgendaFormat })
            })
    }

    computeEvents(eventsRetrieved, day) {
        let eventsInAgendaFormat = {};
        for (let i = -15; i < 85; i++) {
            const time = day.timestamp + i * 24 * 60 * 60 * 1000;
            const strTime = this.timeToString(time);
            if (!eventsInAgendaFormat[strTime]) {
                eventsInAgendaFormat[strTime] = [];
                for (let index = 0; index < eventsRetrieved.length; index++) {
                    const event = eventsRetrieved[index];
                    let dateString = this.timeToString(event.date);
                    if (dateString == strTime)
                        eventsInAgendaFormat[dateString].push(event);
                }
            }
        }
        return eventsInAgendaFormat;
    }

    render() {
        return (
            <View style={styles.container}>
                <Agenda
                    testID={testIDs.agenda.CONTAINER}
                    items={this.state.events}
                    loadItemsForMonth={this.getData.bind(this)}
                    selected={this.timeToString(new Date())}
                    renderItem={this.renderItem.bind(this)}
                    renderEmptyDate={this.renderEmptyDate.bind(this)}
                    rowHasChanged={this.rowHasChanged.bind(this)}
                />
            </View>
        );
    }


    /*
  "date": "2017-12-31T23:00:00.000Z",
  "description": "Session de foot à 5 en salle",
  "event_id": 3,
  "host_id": "3",
  "participants_max": 5,
  "participants_min": 0,
  "photo": "photo",
  "sport": "futsal",
  "spot_id": "2",
  "user_id": 1,
    */
    renderItem(item) {
        let eventIcon = mapSportIcon(item.sport);
        return (
            <TouchableOpacity
                style={calendarStyles.item}
                onPress={() => { RootNavigation.navigateToEvent(item.event_id) }}
            >
                <View style={styles.itemInfos}>
                    <Text>{item.description}</Text>
                    <Image
                        source={eventIcon.image}
                        style={styles.imageSport}
                    />
                    <View style={styles.row}>
                        <Icon
                            name={eventIcon.iconName}
                            type={eventIcon.iconFamily}
                            size={30}
                            style={{ alignSelf: 'center' }}
                            selected={true}
                        />
                        <Text style={{marginLeft : 20, marginTop : 10}}>{(new Date(item.date)).toLocaleTimeString()}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }

    renderEmptyDate() {
        return (
            <View style={calendarStyles.emptyDate}>
                <Text></Text>
            </View>
        );
    }

    rowHasChanged(r1, r2) {
        return r1.name !== r2.name;
    }

    timeToString(time) {
        const date = new Date(time);
        return date.toISOString().split('T')[0];
    }
}

const calendarStyles = StyleSheet.create({
    item: {
        backgroundColor: 'white',
        flex: 1,
        borderRadius: 5,
        padding: 10,
        marginRight: 10,
        marginTop: 17,
        height: 70
    },
    emptyDate: {
        height: 15,
        flex: 1,
        paddingTop: 30
    }
});



const mapStateToProps = (state) => {
    return state
}

export default connect(mapStateToProps)(EventCalendar)


