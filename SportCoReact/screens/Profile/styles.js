import { StyleSheet } from 'react-native';
import { Layout } from '../../constants/Layout'


export const MAX_ON_LINE = 6;
export const MARGIN_BETWEEN_ICONS = 15;

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
        borderWidth: 1,
        borderRadius: 60,

    },
    imageNoBorder: {
        alignSelf: 'center',
        height: 120,
        width: 120,

    },
    imageUserEvent: {
        height: (Layout.window.width / MAX_ON_LINE) - MARGIN_BETWEEN_ICONS,
        width: (Layout.window.width / MAX_ON_LINE) - MARGIN_BETWEEN_ICONS,
        borderRadius: Layout.window.width / (MAX_ON_LINE * 2)
    },
    friendImage : {
        height: (Layout.window.width / MAX_ON_LINE) - MARGIN_BETWEEN_ICONS,
        width: (Layout.window.width / MAX_ON_LINE) - MARGIN_BETWEEN_ICONS,
        borderRadius: Layout.window.width / (MAX_ON_LINE * 2)
    },
    friendImageNoBorder : {
        height: (Layout.window.width / MAX_ON_LINE) - MARGIN_BETWEEN_ICONS,
        width: (Layout.window.width / MAX_ON_LINE) - MARGIN_BETWEEN_ICONS,
    },
    iconOnEvent: {
        height: 14,
        width: 14,
        borderRadius: 7,
        backgroundColor: 'rgb(52,27,252)',
        justifyContent: 'center',
        position: 'absolute',
        bottom: 5,
        right: 5
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
        top : 4,
        textAlign: 'center',
        height : 40,
    },
    inputView: {
        width: '90%',
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 20,
        marginVertical: 30,
        justifyContent : 'center',

        alignSelf: 'center'
    }
});
