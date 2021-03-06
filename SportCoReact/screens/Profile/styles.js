import { StyleSheet, Platform } from 'react-native';
import { Layout } from '../../constants/Layout'
import Colors from '../../constants/Colors';


export const MAX_ON_LINE = 5;
export const MARGIN_BETWEEN_ICONS = 15;
export const MARGIN_LEFT_PROFILE = 30;

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    contentContainer: {
        paddingTop: 30,
    },
    welcomeContainer: {
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 20,
    },
    basicInfoContainer: {
        flexDirection: 'row',
        alignContent: 'space-around'
    },
    basicInfo: {
        flex: 1,
        flexDirection: 'column',
        marginTop: 20
    },
    imageContainer: {
        marginRight: 25
    },
    title: {
        width: Layout.window.width * 0.5,
        color: '#5E5E5E',
        marginTop: 3,
        marginHorizontal: 5,
        fontSize: 14,
    },
    name: {
        marginLeft: 30
    },
    text: {
        fontSize: 17,
        color: 'rgba(96,100,109, 1)',
        lineHeight: 24,
        textAlign: 'center',
    },
    image: {
        alignSelf: 'center',
        height: 120,
        width: 120,
        borderWidth: Platform.OS == 'ios' ? 3 : 0,
        borderRadius: 120,
        borderColor: "#ccc"
    },
    imageNoBorder: {
        alignSelf: 'center',
        height: 120,
        width: 120,
    },
    imageUserEvent: {
        height: ((Layout.window.width - 2*MARGIN_LEFT_PROFILE) / MAX_ON_LINE) - MARGIN_BETWEEN_ICONS,
        width: ((Layout.window.width - 2*MARGIN_LEFT_PROFILE) / MAX_ON_LINE) - MARGIN_BETWEEN_ICONS,
        borderRadius: ((Layout.window.width - 2*MARGIN_LEFT_PROFILE) / MAX_ON_LINE) - MARGIN_BETWEEN_ICONS
    },
    friendImage: {
        height: ((Layout.window.width - 2*MARGIN_LEFT_PROFILE) / MAX_ON_LINE) - MARGIN_BETWEEN_ICONS,
        width: ((Layout.window.width - 2*MARGIN_LEFT_PROFILE) / MAX_ON_LINE) - MARGIN_BETWEEN_ICONS,
        borderRadius: ((Layout.window.width - 2*MARGIN_LEFT_PROFILE) / MAX_ON_LINE) - MARGIN_BETWEEN_ICONS
    },
    friendImageNoBorder: {
        height: ((Layout.window.width - 2*MARGIN_LEFT_PROFILE) / MAX_ON_LINE) - MARGIN_BETWEEN_ICONS,
        width: ((Layout.window.width - 2*MARGIN_LEFT_PROFILE) / MAX_ON_LINE) - MARGIN_BETWEEN_ICONS,
    },
    iconOnEvent: {
        height: 25,
        width: 30,
        borderRadius: 7,
        justifyContent: 'center',
        position: 'absolute',
        bottom: 5,
        right: 5
    },
    iconOnEventFriends: {
        backgroundColor: Colors.timakaColor,
        justifyContent: 'center',
        height: 20,
        width: 20,
        left: 15,
        bottom: 0,
        borderRadius: 10,
    },
    desc: {
        color: '#5E5E5E',
        alignSelf: 'flex-start',
        marginTop: 5,
        marginHorizontal: 30,
        fontSize: 14,
        width: Layout.window.width * 0.75
    },
    divider: {
        backgroundColor: '#C0C0C0',
        width: Layout.window.width - 60,
        margin: 20,
    },
    bottom: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    socialLinks: {
        flex: 1,
        alignItems: 'flex-start',
        flexDirection: 'row',
        width: Layout.window.width,
        marginLeft: 40,
    },
    iconContainer: {
        paddingHorizontal: 8,
        paddingVertical: 15,
    },
    sports: {
        flex: 1,
        flexDirection: 'column'
    },
    textInput: {
        alignItems: 'center',
        overflow: "hidden",
        alignSelf: 'center',
        textAlign: 'center',
        height: 100
    },
    textInputFriends: {
        top: 4,
        textAlign: 'center',
        height: 40,
    },
    inputView: {
        width: 0.7 * Layout.window.width,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 20,
        marginVertical: 30,
        justifyContent: 'center',
        alignSelf: 'center'
    },
    overlay: {
        width: Layout.window.width - 20
    }
});
