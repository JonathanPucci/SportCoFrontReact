import { LEVELS } from '../../constants/DbConstants.js'
import { format, formatDistanceToNow } from 'date-fns'
import { NativeModules, Platform } from 'react-native';
import { enGB, fr } from 'date-fns/locale'

const locales = { enGB, fr }

const locale =
    Platform.OS === 'ios'
        ? NativeModules.SettingsManager.settings.AppleLocale
        : NativeModules.I18nManager.localeIdentifier;

export const seeProfile = (nav, email) => {
    nav.navigate('Profile', { email: email });
}

export function isOrganizedByMe(loggedUser_id, host_id) {
    return loggedUser_id == host_id;
}

export function computeAlreadyJoined(userId, eventData) {
    if (eventData == undefined)
        return false;
    let participants = eventData.participants;
    for (let index = 0; index < participants.length; index++) {
        const participant = participants[index];
        if (participant.user_id == userId)
            return true;
    }
    return false;
}

export function computeDate(dateData) {
    let date = new Date(dateData);
    let local = undefined;
    if (locale != undefined) {
        local = locale.toString().substring(0, 2);
    }
    return format(date, 'PPPPp', {
        locale: locales[local] // or global.__localeId__
    })
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
    return formatDistanceToNow(date)
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

export function mapLevelImage(sport, participant, level = null) {
    let levelIndex = null;

    if (level == null)
        levelIndex = mapScore(participant[sport + '_level']);
    else
        levelIndex = mapScore(level);

    switch (levelIndex) {
        case 0:
            return require('../../assets/images/level1.png');
        case 1:
            return require('../../assets/images/level3.png');
        case 2:
            return require('../../assets/images/level5.png');
        // case 3:
        //     return require('../../assets/images/level4.png');
        // case 4:
        //     return require('../../assets/images/level5.png');
        default:
            break;
    };

    return null
}

export function logDebugInfo(title, info) {
    console.log("=====" + title + "===")
    console.log(info);
    console.log("=====================")
}

export function logDebugError(title, err) {
    console.warn("*******" + title + "*****")
    console.warn(err);
    console.warn("*************************")
}
