const MAP_SPORT_ICON = {
    soccer: {
        image: require('../assets/images/SoccerField.png'),
        iconName: 'ios-football',
        iconFamily: 'Ionicons'
    },
    basket: {
        image: require('../assets/images/basketCourt.jpg'),
        iconName: 'ios-basketball',
        iconFamily: 'Ionicons'
    },
    futsal: {
        image: require('../assets/images/futsal.jpeg'),
        iconName: 'ios-football',
        iconFamily: 'Ionicons'
    },
    volley: {
        image: require('../assets/images/volley.jpg'),
        iconName: 'volleyball',
        iconFamily: 'MaterialCommunityIcons'
    },
    tennis: {
        image: require('../assets/images/tennis.jpg'),
        iconName: 'ios-tennisball',
        iconFamily: 'Ionicons'
    },
    running: {
        image: require('../assets/images/running.jpg'),
        iconName: 'ios-run',
        iconFamily: 'MaterialCommunityIcons'
    },
    workout: {
        image: require('../assets/images/workout.jpeg'),
        iconName: 'ios-fitness',
        iconFamily: 'Ionicons'
    },
    default : {
        image: require('../assets/images/basketCourt.jpg'),
        iconName: 'ios-basketball',
        iconFamily: 'Ionicons'
    }
}


export function mapSportIcon(sport) {
    return MAP_SPORT_ICON[sport];

}