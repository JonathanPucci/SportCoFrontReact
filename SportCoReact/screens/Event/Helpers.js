import { LEVELS } from '../../constants/DbConstants.js'

const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

export function seeProfile(email) {
    this.props.navigation.navigate('Profile', { email: email });
}

export function isOrganizedByMe(loggedUser_id, host_id) {
    return loggedUser_id == host_id;
}

export function computeAlreadyJoined(userId, participants) {
    for (let index = 0; index < participants.length; index++) {
        const participant = participants[index];
        if (participant.user_id == userId)
            return true;
    }
    return false;
}

export function computeDate(dateData) {
    let date = new Date(dateData);
    let dateString = date.toLocaleDateString(undefined, dateOptions);
    let time = date.toLocaleTimeString().split(':');
    let hour = time[0] + 'h' + time[1];
    return dateString.charAt(0).toUpperCase() + dateString.slice(1) + ' ' + hour;
}

export function isEmpty(obj) {
    for (var prop in obj) {
        if (obj.hasOwnProperty(prop)) {
            return false;
        }
    }
    return JSON.stringify(obj) === JSON.stringify({});
}


export function timeSince(date) {
    let minute = 60;
    let hour = minute * 60;
    let day = hour * 24;
    let month = day * 30;
    let year = day * 365;

    let suffix = ' ago';

    let elapsed = Math.floor((Date.now() - date) / 1000);

    if (elapsed < minute) {
        return 'just now';
    }

    // get an array in the form of [number, string]
    let a = elapsed < hour && [Math.floor(elapsed / minute), 'minute'] ||
        elapsed < day && [Math.floor(elapsed / hour), 'hour'] ||
        elapsed < month && [Math.floor(elapsed / day), 'day'] ||
        elapsed < year && [Math.floor(elapsed / month), 'month'] ||
        [Math.floor(elapsed / year), 'year'];

    // pluralise and append suffix
    return a[0] + ' ' + a[1] + (a[0] === 1 ? '' : 's') + suffix;
}

export function convertUTCDateToLocalDate(date) {
    var newDate = new Date(date.getTime() + date.getTimezoneOffset() * 60 * 1000);

    var offset = date.getTimezoneOffset() / 60;
    var hours = date.getHours();

    newDate.setHours(hours - offset);

    return newDate;
}

export function mapScore(ratingOrLevel, isRating = false) {
    if (isRating)
        return LEVELS[ratingOrLevel];
    else
        return LEVELS.indexOf(ratingOrLevel);
}

export function mapLevelImage(sport,participant, level = null) {
    let levelIndex = null;

    if (level == null)
        levelIndex = mapScore(participant[sport + '_level']);
    else
        levelIndex = mapScore(level);

    switch (levelIndex) {
        case 0:
            return require('../../assets/images/level1.png');
        case 1:
            return require('../../assets/images/level2.png');
        case 2:
            return require('../../assets/images/level3.png');
        case 3:
            return require('../../assets/images/level4.png');
        case 4:
            return require('../../assets/images/level5.png');
        default:
            break;
    };

    return null
}
