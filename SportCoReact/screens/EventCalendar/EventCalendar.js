import * as React from 'react';
import { StyleSheet, Image, Text, View, TouchableOpacity, Platform } from 'react-native';
import { connect } from 'react-redux'
import { styles } from './styles'
import { Agenda, LocaleConfig } from 'react-native-calendars';
import SportCoApi from '../../services/apiService';
import { mapSportIcon } from '../../helpers/mapper';
import { Icon, Button, CheckBox } from 'react-native-elements'
import * as RootNavigation from '../../navigation/RootNavigation.js';
import RNCalendarEvents from 'react-native-calendar-events';
import Colors from '../../constants/Colors';
import { translate } from '../../App';
import { USER_CHANGE_CALENDAR_PREF } from '../../Store/Actions';
import { Layout } from '../../constants/Layout';

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

export const saveOrUpdateEventToNativeCalendar = async (event, cId) => {
    let calendarId = cId;
    if (calendarId == undefined || calendarId == null) {
        calendarId = await saveNewTimakaCalendarIfDoesNotExistsOrGetId()
    }
    let startDate = (new Date(event.date)).toISOString();
    let date = new Date(event.date);
    date.setHours(date.getHours() + 1);
    let endDate = date.toISOString();

    let details = {
        calendarId: calendarId,
        startDate: startDate,
        endDate: endDate,
        title: event.sport
    }
    let title = event.sport;
    try {
        let eventsInNativeCalendar = await RNCalendarEvents.fetchAllEvents(startDate, endDate, [calendarId]);
        let sameEvent = eventsInNativeCalendar.find((eventC) => { return eventC.title == details.title && eventC.startDate == details.startDate })
        if (sameEvent != undefined)
            RNCalendarEvents.removeEvent(sameEvent.id);
        RNCalendarEvents.saveEvent(title, details, {})

    } catch (err) {
        console.log(err)
    }
}

export const removeEventFromNativeCalendar = async (event, cId) => {
    let calendarId = cId;
    if (calendarId == undefined || calendarId == null) {
        calendarId = await saveNewTimakaCalendarIfDoesNotExistsOrGetId()
    }
    let startDate = (new Date(event.date)).toISOString();
    let date = new Date(event.date);
    date.setHours(date.getHours() + 1);
    let endDate = date.toISOString();

    let details = {
        startDate: startDate,
        title: event.sport,
        endDate: endDate,
    }
    try {
        let eventsInNativeCalendar = await RNCalendarEvents.fetchAllEvents(startDate, endDate, [calendarId]);
        let sameEvent = eventsInNativeCalendar.find((eventC) => { return eventC.title == details.title && eventC.startDate == details.startDate })
        if (sameEvent != undefined)
            RNCalendarEvents.removeEvent(sameEvent.id);

    } catch (err) {
        console.log(err)
    }
}

export const saveNewTimakaCalendarIfDoesNotExistsOrGetId = async () => {
    let calendars = await RNCalendarEvents.findCalendars();
    let timakaCalendar = (calendars.find((calendar) => { return calendar.title == ('TimakaCalendar') }));

    if (timakaCalendar == undefined) {
        return createTimakaCalendar();
    } else {
        return timakaCalendar.id;
    }
}

export const createTimakaCalendar = async () => {
    RNCalendarEvents.saveCalendar({
        title: 'TimakaCalendar',
        color: Colors.timakaColor,
        name: 'TimakaCalendar',
        entityType: "event",
        accessLevel: "editor",
        source: {
            name: 'TimakaCalendar',
            type: "events",
            isLocalAccount: true
        },
        ownerAccount: 'Timaka'
    }).then((saved) => {
        return saved
    })
}


class EventCalendar extends React.Component {

    constructor() {
        super();
        this.state = {
            events: {},
            calendarId: 'undef'
        }
        this.api = new SportCoApi();
        RNCalendarEvents.authorizeEventStore();


    }

    componentDidMount() {
        RNCalendarEvents.authorizationStatus().then(async (status) => {
            if (status != 'authorized') {
                console.log('asking')
                RNCalendarEvents.authorizeEventStore().then(async (status) => {
                    console.log(status)
                    if (status == 'authorized') {
                        await saveNewTimakaCalendarIfDoesNotExistsOrGetId();
                    }
                });
            } else {
                await saveNewTimakaCalendarIfDoesNotExistsOrGetId();
            }
        })
    }


    saveEventsToNativeCalendar = async () => {
        let calendarId = await saveNewTimakaCalendarIfDoesNotExistsOrGetId();
        let data = await this.api.getSingleEntity("eventparticipant/participantEvents", this.props.auth.user_id)
        let events = data.data;
        for (let index = 0; index < events.length; index++) {
            const event = events[index];
            if (event.date > new Date())
                saveOrUpdateEventToNativeCalendar(event, calendarId)
        }
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
            <View style={{ height: Layout.window.height - 170 }}>
                <View
                    style={{ flex: (styles.container.flex / 6), flexDirection: 'row' }}
                >
                    <Button
                        containerStyle={{ flex: 1, alignSelf: 'center', marginLeft: 10 }}
                        buttonStyle={{ height: 75 }}
                        titleStyle={{ fontSize: 13, textAlign: 'center' }}
                        title={translate("Sync with my phone calendar")}
                        onPress={this.saveEventsToNativeCalendar}
                        icon={
                            <Icon name='sync' color='white' containerStyle={{ marginRight: 0 }} />
                        }
                    />
                    <CheckBox
                        containerStyle={{ flex: 1, height: 75, alignSelf: 'center', marginRight: 10, alignItems: 'center', justifyContent: 'center' }}
                        title={translate("Always Sync with my phone calendar")}
                        textStyle={{ fontSize: 13, textAlign: 'center' }}

                        checked={this.props.auth.user.auto_save_to_calendar}
                        onPress={this.editUserPrefCalendar}
                    />
                </View>
                <View style={styles.container}>
                    <Agenda
                        testID={testIDs.agenda.CONTAINER}
                        items={this.state.events}
                        loadItemsForMonth={this.getData.bind(this)}
                        selected={this.timeToString(new Date())}
                        renderItem={this.renderItem.bind(this)}
                        renderEmptyDate={this.renderEmptyDate.bind(this)}
                        rowHasChanged={this.rowHasChanged.bind(this)}
                        firstDay={1}
                    />

                </View>
            </View>
        );
    }

    editUserPrefCalendar = async () => {
        try {
            let newUserPref = {
                user_id: this.props.auth.user_id,
                auto_save_to_calendar: !this.props.auth.user.auto_save_to_calendar
            }
            await this.api.editEntity('users', newUserPref)
            this.props.dispatch({
                type: USER_CHANGE_CALENDAR_PREF,
                value: !this.props.auth.user.auto_save_to_calendar
            })
        } catch (err) {
            alert(translate('Error trying to save user pref'));
        }
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
                        <Text style={{ marginLeft: 20, marginTop: 10 }}>{(new Date(item.date)).toLocaleTimeString()}</Text>
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


const mapDispatchToProps = dispatch => {
    return {
        dispatch: action => {
            dispatch(action);
        }
    };
};

function mapStateToProps(state) {
    return state;
}

export default (connectedApp = connect(mapStateToProps, mapDispatchToProps)(EventCalendar));


