
const MAP_SPORT_ICON = {
    soccer: {
        image: require('../assets/images/SoccerField.png'),
        sportIcon: require('../assets/images/sportMapIcons/soccer3.png'),
        sportFilterImage: require('../assets/images/filterSports/soccer.png'),
        iconName: 'ios-football',
        iconFamily: 'ionicon'
    },
    basket: {
        image: require('../assets/images/basketCourt.jpg'),
        sportIcon: require('../assets/images/sportMapIcons/basket3.png'),
        sportFilterImage: require('../assets/images/filterSports/basket.png'),
        iconName: 'ios-basketball',
        iconFamily: 'ionicon'
    },
    futsal: {
        image: require('../assets/images/futsal.jpeg'),
        sportIcon: require('../assets/images/sportMapIcons/soccer3.png'),
        sportFilterImage: require('../assets/images/filterSports/soccer.png'),
        iconName: 'soccer-field',
        iconFamily: 'material-community'
    },
    freeski: {
        image: require('../assets/images/freeski.jpg'),
        sportIcon: require('../assets/images/sportMapIcons/freeski.png'),
        sportFilterImage: require('../assets/images/filterSports/ski.png'),
        iconName: 'mountains',
        iconFamily: 'foundation'
    },
    volley: {
        image: require('../assets/images/volley.jpg'),
        sportIcon: require('../assets/images/sportMapIcons/volley3.png'),
        sportFilterImage: require('../assets/images/filterSports/volley.png'),
        iconName: 'volleyball',
        iconFamily: 'material-community'
    },
    beachvolley: {
        image: require('../assets/images/volley.jpg'),
        sportIcon: require('../assets/images/sportMapIcons/volley3.png'),
        sportFilterImage: require('../assets/images/filterSports/volley.png'),
        iconName: 'beach',
        iconFamily: 'material-community'
    },
    tennis: {
        image: require('../assets/images/tennis.jpg'),
        sportIcon: require('../assets/images/sportMapIcons/tennis3.png'),
        sportFilterImage: require('../assets/images/filterSports/tennis.png'),
        iconName: 'ios-tennisball',
        iconFamily: 'ionicon'
    },
    running: {
        image: require('../assets/images/running.jpg'),
        sportIcon: require('../assets/images/sportMapIcons/running2.png'),
        sportFilterImage: require('../assets/images/filterSports/running.png'),
        iconName: 'run',
        iconFamily: 'material-community'
    },
    workout: {
        image: require('../assets/images/workout.jpeg'),
        sportIcon: require('../assets/images/sportMapIcons/workout2.png'),
        sportFilterImage: require('../assets/images/filterSports/workout.png'),
        iconName: 'ios-fitness',
        iconFamily: 'ionicon'
    },
    vtt: {
        image: require('../assets/images/VTT.jpg'),
        sportIcon: require('../assets/images/sportMapIcons/VTT.png'),
        iconName: 'ios-bicycle',
        iconFamily: 'ionicon'
    },
    roadbike: {
        image: require('../assets/images/roadbike.jpeg'),
        sportIcon: require('../assets/images/sportMapIcons/VTT.png'),
        iconName: 'ios-bicycle',
        iconFamily: 'ionicon'
    },
    default: {
        image: require('../assets/images/basketCourt.jpg'),
        sportIcon: require('../assets/images/map-pointer.gif'),
        iconName: 'ios-basketball',
        iconFamily: 'ionicon'
    }
}


MAP_NOTIF_INFO = {
    EVENT_CHANGED: {
        messageBody: ('  Event has changed, check it out !'),
        emojiName: 'man-raising-hand',
        iconName: 'new-message'
    },
    NEW_EVENT: {
        messageBody: ('  New event nearby, interested?'),
        emojiName: 'man-bowing',
        iconName: 'new'
    },
    INVIT_EVENT: {
        messageBody: ('  shared an event with you, check it out !'),
        emojiName: 'man-bowing',
        iconName: 'new'
    },
    EVENT_CANCELED: {
        messageBody: ('  Event has been canceled, sorry !'),
        emojiName: 'man-shrugging',
        iconName: 'circle-with-cross'
    },
    PARTICIPANT_JOINED: {
        messageBody: ('  New participant to your event'),
        emojiName: 'man-running',
        iconName: 'add-user'
    },
    PARTICIPANT_LEFT: {
        messageBody: ('  Participant left your event'),
        emojiName: 'man-running',
        iconName: 'remove-user'
    },
    WANTS_TO_JOIN_TEAM: {
        messageBody: ('  Someone wants to join your team'),
        emojiName: 'man-raising-hand',
        iconName: 'new'
    },
    NEW_TEAM_MEMBER: {
        messageBody: ('  Someone joined your team'),
        emojiName: 'man-raising-hand',
        iconName: 'new'
    },
}


export function mapSportIcon(sport) {
    return MAP_SPORT_ICON[sport];

}


export function mapNotifInfo(notif) {
    return MAP_NOTIF_INFO[notif];

}