const MAP_SPORT_ICON = {
    soccer: {
        image: require('../assets/images/SoccerField.png'),
        iconName: 'ios-football',
        iconFamily: 'ionicon'
    },
    basket: {
        image: require('../assets/images/basketCourt.jpg'),
        iconName: 'ios-basketball',
        iconFamily: 'ionicon'
    },
    futsal: {
        image: require('../assets/images/futsal.jpeg'),
        iconName: 'ios-football',
        iconFamily: 'ionicon'
    },
    volley: {
        image: require('../assets/images/volley.jpg'),
        iconName: 'volleyball',
        iconFamily: 'material-community'
    },
    beachvolley: {
        image: require('../assets/images/volley.jpg'),
        iconName: 'volleyball',
        iconFamily: 'material-community'
    },
    tennis: {
        image: require('../assets/images/tennis.jpg'),
        iconName: 'ios-tennisball',
        iconFamily: 'ionicon'
    },
    running: {
        image: require('../assets/images/running.jpg'),
        iconName: 'run',
        iconFamily: 'material-community'
    },
    workout: {
        image: require('../assets/images/workout.jpeg'),
        iconName: 'ios-fitness',
        iconFamily: 'ionicon'
    },
    vtt:{
        image: require('../assets/images/VTT.jpg'),
        iconName: 'ios-bicycle',
        iconFamily: 'ionicon'
    },
    default : {
        image: require('../assets/images/basketCourt.jpg'),
        iconName: 'ios-basketball',
        iconFamily: 'ionicon'
    }
}


export function mapSportIcon(sport) {
    return MAP_SPORT_ICON[sport];

}