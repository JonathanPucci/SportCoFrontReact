const MAP_SPORT_ICON = {
    soccer: {
        image: require('../assets/images/SoccerField.png'),
        sportIcon : require('../assets/images/sportMapIcons/soccer3.png'),
        iconName: 'ios-football',
        iconFamily: 'ionicon'
    },
    basket: {
        image: require('../assets/images/basketCourt.jpg'),
        sportIcon : require('../assets/images/sportMapIcons/basket3.png'),
        iconName: 'ios-basketball',
        iconFamily: 'ionicon'
    },
    futsal: {
        image: require('../assets/images/futsal.jpeg'),
        sportIcon : require('../assets/images/sportMapIcons/soccer3.png'),
        iconName: 'ios-football',
        iconFamily: 'ionicon'
    },
    volley: {
        image: require('../assets/images/volley.jpg'),
        sportIcon : require('../assets/images/sportMapIcons/volley3.png'),
        iconName: 'volleyball',
        iconFamily: 'material-community'
    },
    beachvolley: {
        image: require('../assets/images/volley.jpg'),
        sportIcon : require('../assets/images/sportMapIcons/volley3.png'),
        iconName: 'volleyball',
        iconFamily: 'material-community'
    },
    tennis: {
        image: require('../assets/images/tennis.jpg'),
        sportIcon : require('../assets/images/sportMapIcons/tennis3.png'),
        iconName: 'ios-tennisball',
        iconFamily: 'ionicon'
    },
    running: {
        image: require('../assets/images/running.jpg'),
        sportIcon : require('../assets/images/sportMapIcons/running2.png'),
        iconName: 'run',
        iconFamily: 'material-community'
    },
    workout: {
        image: require('../assets/images/workout.jpeg'),
        sportIcon : require('../assets/images/sportMapIcons/workout2.png'),
        iconName: 'ios-fitness',
        iconFamily: 'ionicon'
    },
    vtt:{
        image: require('../assets/images/VTT.jpg'),
        sportIcon : require('../assets/images/sportMapIcons/VTT.png'),
        iconName: 'ios-bicycle',
        iconFamily: 'ionicon'
    },
    roadbike:{
        image: require('../assets/images/roadbike.jpeg'),
        sportIcon : require('../assets/images/sportMapIcons/VTT.png'),
        iconName: 'ios-bicycle',
        iconFamily: 'ionicon'
    },
    default : {
        image: require('../assets/images/basketCourt.jpg'),
        sportIcon : require('../assets/images/map-pointer.gif'),
        iconName: 'ios-basketball',
        iconFamily: 'ionicon'
    }
}


export function mapSportIcon(sport) {
    return MAP_SPORT_ICON[sport];

}