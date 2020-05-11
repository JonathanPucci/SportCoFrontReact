import { StyleSheet } from 'react-native';
import { Layout } from '../../constants/Layout'


export const MAX_ON_LINE = 4;
export const MARGIN_BETWEEN_ICONS = 15;
export const IMAGE_SIZE = (Layout.window.width / MAX_ON_LINE) - 2*MARGIN_BETWEEN_ICONS;
export const OPTION_ICON_SIZE = 20;

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
        borderWidth: 3,
        borderRadius: 60,
        borderColor : "#ccc"
    },
    imageNoBorder: {
        alignSelf: 'center',
        height: 120,
        width: 120,

    },
    memberImage : {
        height: IMAGE_SIZE,
        width: IMAGE_SIZE,
        borderRadius: Layout.window.width / (MAX_ON_LINE * 2),
        top : OPTION_ICON_SIZE,
        left : OPTION_ICON_SIZE/2,
    },
    memberImageNoBorder : {
        height: IMAGE_SIZE,
        width: IMAGE_SIZE,
    },
    viewMember : {
        height: IMAGE_SIZE + OPTION_ICON_SIZE,
        width: IMAGE_SIZE + OPTION_ICON_SIZE,
    },
    iconOnEvent: {
        height: 14,
        width: 14,
        borderRadius: 7,
        justifyContent: 'center',
        position: 'absolute',
        bottom: 5,
        right: 15
    },
    iconOnEventName: {
        borderRadius: 10,
        height: 20,
        width: 20,
        backgroundColor: 'rgb(52,27,252)',
        justifyContent: 'center',
    },
    iconOnEventCrown: {
        justifyContent: 'center',
        right: 10
    },
    iconOnEventAccept:{
        height: OPTION_ICON_SIZE,
        width: OPTION_ICON_SIZE,
        position: 'absolute',
        bottom: IMAGE_SIZE + OPTION_ICON_SIZE/2,
        left: IMAGE_SIZE/2 + OPTION_ICON_SIZE/2
    },
    iconOnEventDecline:{
        height: OPTION_ICON_SIZE,
        width: OPTION_ICON_SIZE,
        position: 'absolute',
        bottom: IMAGE_SIZE + OPTION_ICON_SIZE/2,
        right: IMAGE_SIZE + OPTION_ICON_SIZE/2
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
    },
    overlay : {
        width : Layout.window.width -20
    }
});
